import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import { Prisma } from '../generated/prisma/index.js';
import {
  ApproveChangeRequestDto,
  CreateChangeRequestDto,
  PhdEventPayload,
  QueryChangeRequestsDto,
  RejectChangeRequestDto,
} from '../../../../lib/contracts/src/dto/change-request.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  PhdChangeRequestAlreadyProcessedException,
  PhdChangeRequestAssignmentNotFoundException,
  PhdChangeRequestInvalidDataException,
  PhdChangeRequestNotFoundException,
  PhdChangeRequestRejectReasonRequiredException,
  PhdChangeRequestStudentNotFoundException,
} from './change-request.exceptions.js';
import {
  PhdSupervisorNotFoundException,
  PhdSupervisorQuotaExceededException,
} from '../supervisor/supervisor.exceptions.js';

const QUOTA_MAP: Record<string, number> = {
  GIAO_SU: 7,
  PHO_GIAO_SU: 5,
  TIEN_SI_KHOA_HOC: 3,
  TIEN_SI: 3,
};

const LOAD_WEIGHT: Record<string, number> = {
  HUONG_DAN_CHINH: 1.0,
  DONG_HUONG_DAN: 0.5,
};

@Injectable()
export class ChangeRequestService {
  private readonly logger = new Logger(ChangeRequestService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() @Inject('NOTIFICATION_SERVICE') private readonly notificationClient?: ClientProxy,
  ) {}

  // ─── [S5-20] Nộp đơn đề nghị thay đổi ───────────────────────────────────────

  async submitChangeRequest(actorId: string, dto: CreateChangeRequestDto) {
    const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { id: dto.ncsId } });
    if (!ncs) throw new PhdChangeRequestStudentNotFoundException(dto.ncsId);

    // Validate dữ liệu theo từng loại đề nghị
    if (dto.loai === 'DOI_DE_TAI') {
      if (!dto.tenDeTaiMoi || !dto.tenDeTaiMoi.trim()) {
        throw new PhdChangeRequestInvalidDataException('tenDeTaiMoi là bắt buộc khi xin đổi đề tài');
      }
    } else if (dto.loai === 'DOI_GVHD') {
      if (!dto.phanCongCuId) {
        throw new PhdChangeRequestInvalidDataException('phanCongCuId là bắt buộc khi xin đổi GVHD');
      }
      if (!dto.gvhdMoiId) {
        throw new PhdChangeRequestInvalidDataException('gvhdMoiId là bắt buộc khi xin đổi GVHD');
      }

      const phanCongCu = await this.prisma.phanCongHuongDan.findUnique({
        where: { id: dto.phanCongCuId },
      });
      if (!phanCongCu || phanCongCu.ncsId !== dto.ncsId) {
        throw new PhdChangeRequestAssignmentNotFoundException(dto.phanCongCuId);
      }
      if (phanCongCu.trangThai !== 'DANG_HIEU_LUC') {
        throw new PhdChangeRequestInvalidDataException('Phân công GVHD cũ không ở trạng thái DANG_HIEU_LUC');
      }

      const gvhdMoi = await this.prisma.giangVienHuongDan.findUnique({
        where: { id: dto.gvhdMoiId },
      });
      if (!gvhdMoi) throw new PhdSupervisorNotFoundException(dto.gvhdMoiId);
    } else if (dto.loai === 'GIA_HAN') {
      if (!dto.hanMoiDeNghi) {
        throw new PhdChangeRequestInvalidDataException('hanMoiDeNghi là bắt buộc khi xin gia hạn học tập');
      }
      const newDeadline = new Date(dto.hanMoiDeNghi);
      if (ncs.hanBuocThoiHoc && newDeadline > ncs.hanBuocThoiHoc) {
        throw new PhdChangeRequestInvalidDataException(
          `Hạn gia hạn mới (${dto.hanMoiDeNghi}) không được vượt quá hạn buộc thôi học (${ncs.hanBuocThoiHoc.toISOString().slice(0, 10)})`,
        );
      }
    }

    // Tạo bản ghi đề nghị điều chỉnh với trạng thái CHO_DUYET
    const changeRequest = await this.prisma.deNghiDieuChinh.create({
      data: {
        ncsId: dto.ncsId,
        loai: dto.loai as any,
        lyDo: dto.lyDo,
        tenDeTaiMoi: dto.tenDeTaiMoi ?? null,
        hanMoiDeNghi: dto.hanMoiDeNghi ? new Date(dto.hanMoiDeNghi) : null,
        phanCongCuId: dto.phanCongCuId ?? null,
        gvhdMoiId: dto.gvhdMoiId ?? null,
        nguoiDeNghiId: actorId,
        trangThai: 'CHO_DUYET' as any,
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'CHANGE_REQUEST_SUBMIT',
        entityType: 'DeNghiDieuChinh',
        entityId: changeRequest.id,
        ncsId: dto.ncsId,
        newValue: {
          loai: dto.loai,
          lyDo: dto.lyDo,
          tenDeTaiMoi: dto.tenDeTaiMoi,
          phanCongCuId: dto.phanCongCuId,
          gvhdMoiId: dto.gvhdMoiId,
        },
      },
    });

    return changeRequest;
  }

  // ─── [S5-20] Phê duyệt đơn đề nghị thay đổi ─────────────────────────────────

  async approveChangeRequest(
    actorId: string,
    id: string,
    dto: ApproveChangeRequestDto,
    correlationId?: string,
  ) {
    const changeRequest = await this.prisma.deNghiDieuChinh.findUnique({
      where: { id },
      include: {
        phanCongCu: true,
      },
    });
    if (!changeRequest) throw new PhdChangeRequestNotFoundException(id);
    if (changeRequest.trangThai !== 'CHO_DUYET') {
      throw new PhdChangeRequestAlreadyProcessedException(id, changeRequest.trangThai);
    }

    const result = await this.prisma.$transaction(async (tx) => {
      let createdQuyetDinh: any = null;
      let extraData: any = {};

      if (changeRequest.loai === 'DOI_DE_TAI') {
        // BR-04: Đóng đề tài cũ sang DA_THAY_THE (không hard-delete)
        const oldDeTai = await tx.deTai.findFirst({
          where: { ncsId: changeRequest.ncsId, trangThai: 'HIEU_LUC' as any },
        });

        if (oldDeTai) {
          await tx.deTai.update({
            where: { id: oldDeTai.id },
            data: { trangThai: 'DA_THAY_THE' as any },
          });
        }

        // Quyết định pháp lý
        createdQuyetDinh = await tx.quyetDinh.create({
          data: {
            ncsId: changeRequest.ncsId,
            loai: 'GIAO_DE_TAI' as any,
            soQuyetDinh: dto.soQuyetDinh,
            ngayQuyetDinh: new Date(dto.ngayQuyetDinh),
            fileId: dto.fileId,
            ghiChu: dto.ghiChu ?? `Phê duyệt đổi tên đề tài theo đơn ${id}`,
            nguoiTaoId: actorId,
            trangThai: 'HIEU_LUC' as any,
          },
        });

        // Tạo đề tài mới
        const newDeTai = await tx.deTai.create({
          data: {
            ncsId: changeRequest.ncsId,
            tenDeTai: changeRequest.tenDeTaiMoi!,
            trangThai: 'HIEU_LUC' as any,
            quyetDinhId: createdQuyetDinh.id,
          },
        });

        extraData = { oldDeTaiId: oldDeTai?.id, newDeTaiId: newDeTai.id };
      } else if (changeRequest.loai === 'DOI_GVHD') {
        if (!changeRequest.phanCongCuId || !changeRequest.gvhdMoiId) {
          throw new PhdChangeRequestInvalidDataException('Thiếu thông tin phân công cũ hoặc GVHD mới');
        }

        // Pessimistic Lock trên GVHD mới để chống race condition vượt hạn ngạch
        const gvhdMoiRows = await tx.$queryRaw<any[]>`
          SELECT * FROM giang_vien_huong_dan
          WHERE id = ${changeRequest.gvhdMoiId}
          FOR UPDATE
        `;
        const gvhdMoi = gvhdMoiRows[0];
        if (!gvhdMoi) throw new PhdSupervisorNotFoundException(changeRequest.gvhdMoiId);

        // Xác định vai trò mới (mặc định lấy theo vai trò cũ)
        const vaiTroMoi = changeRequest.phanCongCu?.vaiTro ?? 'HUONG_DAN_CHINH';
        const weight = LOAD_WEIGHT[vaiTroMoi] ?? 1.0;

        // Tính tải hiện tại của GVHD mới
        const activeAssignments = await tx.phanCongHuongDan.findMany({
          where: {
            gvhdId: changeRequest.gvhdMoiId,
            trangThai: 'DANG_HIEU_LUC' as any,
          },
          select: { vaiTro: true, trongSo: true },
        });

        const currentLoad = activeAssignments.reduce(
          (sum, a) => sum + Number(a.trongSo ?? LOAD_WEIGHT[a.vaiTro] ?? 1.0),
          0,
        );
        const maxQuota = gvhdMoi.max_ncs_cho_phep ?? QUOTA_MAP[gvhdMoi.hoc_ham_hoc_vi] ?? 3;

        if (currentLoad + weight > maxQuota) {
          throw new PhdSupervisorQuotaExceededException(
            gvhdMoi.ho_ten,
            currentLoad,
            maxQuota,
          );
        }

        // BR-04: Cập nhật phân công cũ sang DEACTIVATE
        await tx.phanCongHuongDan.update({
          where: { id: changeRequest.phanCongCuId },
          data: { trangThai: 'DEACTIVATE' as any },
        });

        // Giảm tải GVHD cũ
        const oldGvhdId = changeRequest.phanCongCu?.gvhdId;
        if (oldGvhdId) {
          const oldWeight = Number(changeRequest.phanCongCu?.trongSo ?? 1.0);
          await tx.giangVienHuongDan.update({
            where: { id: oldGvhdId },
            data: { soNcsDangHuongDan: { decrement: oldWeight } },
          });
        }

        // Tạo quyết định thay đổi GVHD
        createdQuyetDinh = await tx.quyetDinh.create({
          data: {
            ncsId: changeRequest.ncsId,
            loai: 'PHAN_CONG_GVHD' as any,
            soQuyetDinh: dto.soQuyetDinh,
            ngayQuyetDinh: new Date(dto.ngayQuyetDinh),
            fileId: dto.fileId,
            ghiChu: dto.ghiChu ?? `Phê duyệt đổi GVHD theo đơn ${id}`,
            nguoiTaoId: actorId,
            trangThai: 'HIEU_LUC' as any,
          },
        });

        // Tạo phân công mới
        const newAssignment = await tx.phanCongHuongDan.create({
          data: {
            ncsId: changeRequest.ncsId,
            gvhdId: changeRequest.gvhdMoiId,
            vaiTro: vaiTroMoi as any,
            trongSo: new Prisma.Decimal(weight),
            quyetDinhId: createdQuyetDinh.id,
            trangThai: 'DANG_HIEU_LUC' as any,
          },
        });

        // Tăng tải GVHD mới
        await tx.giangVienHuongDan.update({
          where: { id: changeRequest.gvhdMoiId },
          data: { soNcsDangHuongDan: { increment: weight } },
        });

        extraData = { newAssignmentId: newAssignment.id };
      } else if (changeRequest.loai === 'GIA_HAN') {
        // Cập nhật NCS
        await tx.nghienCuuSinh.update({
          where: { id: changeRequest.ncsId },
          data: {
            hanGiaHan: changeRequest.hanMoiDeNghi,
            trangThai: 'GIA_HAN' as any,
          },
        });

        createdQuyetDinh = await tx.quyetDinh.create({
          data: {
            ncsId: changeRequest.ncsId,
            loai: 'GIA_HAN' as any,
            soQuyetDinh: dto.soQuyetDinh,
            ngayQuyetDinh: new Date(dto.ngayQuyetDinh),
            fileId: dto.fileId,
            ghiChu: dto.ghiChu ?? `Phê duyệt gia hạn học tập theo đơn ${id}`,
            nguoiTaoId: actorId,
            trangThai: 'HIEU_LUC' as any,
          },
        });
      }

      // Cập nhật đơn đề nghị sang DA_DUYET
      const updatedRequest = await tx.deNghiDieuChinh.update({
        where: { id },
        data: {
          trangThai: 'DA_DUYET' as any,
          nguoiDuyetId: actorId,
          ngayDuyet: new Date(),
          quyetDinhId: createdQuyetDinh?.id ?? null,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          actorId,
          action: 'CHANGE_REQUEST_APPROVE',
          entityType: 'DeNghiDieuChinh',
          entityId: id,
          ncsId: changeRequest.ncsId,
          newValue: {
            soQuyetDinh: dto.soQuyetDinh,
            ngayQuyetDinh: dto.ngayQuyetDinh,
            extraData,
          },
        },
      });

      return { updatedRequest, createdQuyetDinh };
    });

    // ─── [S5-22] Bắn TCP Event cho notification-service ─────────────────────
    this.emitApprovedEvent({
      actorId,
      ncsId: changeRequest.ncsId,
      correlationId,
      changeRequestId: id,
      loai: changeRequest.loai,
      soQuyetDinh: dto.soQuyetDinh,
      quyetDinhId: result.createdQuyetDinh?.id,
      tenDeTaiMoi: changeRequest.tenDeTaiMoi,
      gvhdMoiId: changeRequest.gvhdMoiId,
    });

    return result;
  }

  // ─── [S5-20] Từ chối đơn đề nghị thay đổi ─────────────────────────────────

  async rejectChangeRequest(actorId: string, id: string, dto: RejectChangeRequestDto) {
    if (!dto.lyDoTuChoi || !dto.lyDoTuChoi.trim()) {
      throw new PhdChangeRequestRejectReasonRequiredException();
    }

    const changeRequest = await this.prisma.deNghiDieuChinh.findUnique({ where: { id } });
    if (!changeRequest) throw new PhdChangeRequestNotFoundException(id);
    if (changeRequest.trangThai !== 'CHO_DUYET') {
      throw new PhdChangeRequestAlreadyProcessedException(id, changeRequest.trangThai);
    }

    const updated = await this.prisma.deNghiDieuChinh.update({
      where: { id },
      data: {
        trangThai: 'TU_CHOI' as any,
        lyDoTuChoi: dto.lyDoTuChoi.trim(),
        nguoiDuyetId: actorId,
        ngayDuyet: new Date(),
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'CHANGE_REQUEST_REJECT',
        entityType: 'DeNghiDieuChinh',
        entityId: id,
        ncsId: changeRequest.ncsId,
        newValue: { lyDoTuChoi: dto.lyDoTuChoi.trim() },
      },
    });

    return updated;
  }

  // ─── Truy vấn đơn đề nghị ──────────────────────────────────────────────────

  async listChangeRequests(query: QueryChangeRequestsDto) {
    const where: Prisma.DeNghiDieuChinhWhereInput = {};
    if (query.ncsId) where.ncsId = query.ncsId;
    if (query.loai) where.loai = query.loai as any;
    if (query.trangThai) where.trangThai = query.trangThai as any;

    const limit = query.limit ?? 20;
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.deNghiDieuChinh.findMany({
        where,
        include: {
          ncs: { select: { id: true, mshv: true, hoTen: true } },
          gvhdMoi: { select: { id: true, hoTen: true, hocHamHocVi: true, email: true } },
          phanCongCu: {
            include: {
              gvhd: { select: { id: true, hoTen: true, hocHamHocVi: true } },
            },
          },
          quyetDinh: {
            select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true, loai: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.deNghiDieuChinh.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getChangeRequest(id: string) {
    const item = await this.prisma.deNghiDieuChinh.findUnique({
      where: { id },
      include: {
        ncs: { select: { id: true, mshv: true, hoTen: true, email: true } },
        gvhdMoi: { select: { id: true, hoTen: true, hocHamHocVi: true, email: true } },
        phanCongCu: {
          include: {
            gvhd: { select: { id: true, hoTen: true, hocHamHocVi: true } },
          },
        },
        quyetDinh: true,
      },
    });
    if (!item) throw new PhdChangeRequestNotFoundException(id);
    return item;
  }

  // ─── [S5-22] Helper phát Event TCP sang notification-service ────────────────

  private emitApprovedEvent(params: {
    actorId: string;
    ncsId: string;
    correlationId?: string;
    changeRequestId: string;
    loai: string;
    soQuyetDinh: string;
    quyetDinhId?: string;
    tenDeTaiMoi?: string | null;
    gvhdMoiId?: string | null;
  }) {
    if (!this.notificationClient) {
      this.logger.debug('NotificationClient không được cấu hình. Bỏ qua phát TCP Event.');
      return;
    }

    const payload: PhdEventPayload = {
      eventId: randomUUID(),
      eventType: 'phd.change_request.approved',
      occurredAt: new Date().toISOString(),
      actorId: params.actorId,
      ncsId: params.ncsId,
      correlationId: params.correlationId,
      data: {
        changeRequestId: params.changeRequestId,
        loai: params.loai,
        soQuyetDinh: params.soQuyetDinh,
        quyetDinhId: params.quyetDinhId,
        tenDeTaiMoi: params.tenDeTaiMoi,
        gvhdMoiId: params.gvhdMoiId,
      },
    };

    try {
      this.notificationClient.emit('phd.change_request.approved', payload);
      this.logger.log(`[EVENT] Đã phát sự kiện phd.change_request.approved: ${payload.eventId}`);
    } catch (err: any) {
      this.logger.warn(`Không thể phát TCP Event phd.change_request.approved: ${err?.message}`);
    }
  }
}

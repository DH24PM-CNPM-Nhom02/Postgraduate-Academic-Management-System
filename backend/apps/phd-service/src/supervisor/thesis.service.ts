import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/index.js';
import {
  CreateThesisDto,
  QueryThesisDto,
  UpdateThesisDto,
} from '../../../../lib/contracts/src/dto/thesis.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  PhdThesisActiveExistsException,
  PhdThesisNotFoundException,
  PhdThesisStudentNotFoundException,
} from './supervisor.exceptions.js';

@Injectable()
export class ThesisService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── [S5-18] Quản lý tên đề tài, số quyết định và ngày ký ───────────────

  /**
   * Tạo đề tài mới cho NCS.
   * Kiểm tra NCS đã có đề tài HIEU_LUC chưa (nếu có → báo lỗi).
   */
  async createThesis(actorId: string, dto: CreateThesisDto) {
    const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { id: dto.ncsId } });
    if (!ncs) throw new PhdThesisStudentNotFoundException(dto.ncsId);

    const existing = await this.prisma.deTai.findFirst({
      where: { ncsId: dto.ncsId, trangThai: 'HIEU_LUC' as any },
    });
    if (existing) throw new PhdThesisActiveExistsException(dto.ncsId);

    return this.prisma.$transaction(async (tx) => {
      // Tạo quyết định giao đề tài
      const quyetDinh = await tx.quyetDinh.create({
        data: {
          ncsId: dto.ncsId,
          loai: 'GIAO_DE_TAI' as any,
          soQuyetDinh: dto.soQuyetDinh,
          ngayQuyetDinh: new Date(dto.ngayQuyetDinh),
          fileId: dto.fileId,
          ghiChu: dto.ghiChu,
          nguoiTaoId: actorId,
          trangThai: 'HIEU_LUC' as any,
        },
      });

      // Tạo đề tài
      const deTai = await tx.deTai.create({
        data: {
          ncsId: dto.ncsId,
          tenDeTai: dto.tenDeTai,
          trangThai: 'HIEU_LUC' as any,
          quyetDinhId: quyetDinh.id,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          actorId,
          action: 'THESIS_CREATE',
          entityType: 'DeTai',
          entityId: deTai.id,
          ncsId: dto.ncsId,
          newValue: {
            tenDeTai: dto.tenDeTai,
            soQuyetDinh: dto.soQuyetDinh,
            ngayQuyetDinh: dto.ngayQuyetDinh,
          },
        },
      });

      return { deTai, quyetDinh };
    });
  }

  /**
   * Danh sách đề tài (có thể lọc theo NCS, trạng thái, từ khóa).
   */
  async listTheses(query: QueryThesisDto) {
    const where: Prisma.DeTaiWhereInput = {};
    if (query.ncsId) where.ncsId = query.ncsId;
    if (query.trangThai) where.trangThai = query.trangThai as any;
    if (query.search) where.tenDeTai = { contains: query.search };

    return this.prisma.deTai.findMany({
      where,
      include: {
        ncs: { select: { id: true, mshv: true, hoTen: true } },
        quyetDinh: {
          select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true, loai: true, trangThai: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Chi tiết một đề tài.
   */
  async getThesis(id: string) {
    const dt = await this.prisma.deTai.findUnique({
      where: { id },
      include: {
        ncs: { select: { id: true, mshv: true, hoTen: true, email: true } },
        quyetDinh: true,
      },
    });
    if (!dt) throw new PhdThesisNotFoundException(id);
    return dt;
  }

  /**
   * Lấy đề tài hiện hành (HIEU_LUC) của một NCS.
   */
  async getCurrentThesisByNcs(ncsId: string) {
    const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { id: ncsId } });
    if (!ncs) throw new PhdThesisStudentNotFoundException(ncsId);

    const deTai = await this.prisma.deTai.findFirst({
      where: { ncsId, trangThai: 'HIEU_LUC' as any },
      include: {
        quyetDinh: {
          select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true },
        },
      },
    });

    return {
      ncsId,
      ncs: { mshv: ncs.mshv, hoTen: ncs.hoTen },
      deTaiHienTai: deTai ?? null,
    };
  }

  /**
   * Cập nhật tên đề tài (BR-04):
   * - Đặt đề tài cũ = DA_THAY_THE (không xóa).
   * - Tạo quyết định điều chỉnh đề tài mới.
   * - Tạo bản ghi đề tài mới với trạng thái HIEU_LUC.
   * Tất cả trong một transaction.
   */
  async updateThesis(actorId: string, id: string, dto: UpdateThesisDto) {
    const existing = await this.prisma.deTai.findUnique({ where: { id } });
    if (!existing) throw new PhdThesisNotFoundException(id);

    return this.prisma.$transaction(async (tx) => {
      // BR-04: Đổi đề tài cũ sang DA_THAY_THE (không hard-delete)
      await tx.deTai.update({
        where: { id },
        data: { trangThai: 'DA_THAY_THE' as any },
      });

      // Tạo quyết định điều chỉnh đề tài
      const quyetDinh = await tx.quyetDinh.create({
        data: {
          ncsId: existing.ncsId,
          loai: 'GIAO_DE_TAI' as any,
          soQuyetDinh: dto.soQuyetDinh,
          ngayQuyetDinh: new Date(dto.ngayQuyetDinh),
          fileId: dto.fileId,
          ghiChu: dto.ghiChu ?? `Điều chỉnh tên đề tài. Lý do: ${dto.lyDo}`,
          nguoiTaoId: actorId,
          trangThai: 'HIEU_LUC' as any,
        },
      });

      // Tạo đề tài mới
      const newDeTai = await tx.deTai.create({
        data: {
          ncsId: existing.ncsId,
          tenDeTai: dto.tenDeTaiMoi,
          trangThai: 'HIEU_LUC' as any,
          quyetDinhId: quyetDinh.id,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          actorId,
          action: 'THESIS_UPDATE',
          entityType: 'DeTai',
          entityId: newDeTai.id,
          ncsId: existing.ncsId,
          oldValue: { deTaiCuId: id, tenDeTaiCu: existing.tenDeTai },
          newValue: {
            deTaiMoiId: newDeTai.id,
            tenDeTaiMoi: dto.tenDeTaiMoi,
            lyDo: dto.lyDo,
            soQuyetDinh: dto.soQuyetDinh,
            ngayQuyetDinh: dto.ngayQuyetDinh,
          },
        },
      });

      return { replacedId: id, newDeTai, quyetDinh };
    });
  }

  /**
   * Lịch sử tất cả đề tài (kể cả DA_THAY_THE) của một NCS.
   */
  async getThesisHistory(ncsId: string) {
    const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { id: ncsId } });
    if (!ncs) throw new PhdThesisStudentNotFoundException(ncsId);

    return this.prisma.deTai.findMany({
      where: { ncsId },
      include: {
        quyetDinh: {
          select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true, loai: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

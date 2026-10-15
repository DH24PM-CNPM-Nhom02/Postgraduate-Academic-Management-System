import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import { Prisma } from '../generated/prisma/index.js';
import {
  AssignSupervisorDto,
  ChangeSupervisorDto,
  CreateSupervisorDto,
  QueryAssignmentsDto,
  QuerySupervisorsDto,
  UpdateSupervisorDto,
} from '../../../../lib/contracts/src/dto/supervisor.dto.js';
import { PhdEventPayload } from '../../../../lib/contracts/src/dto/change-request.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  PhdSupervisorAssignmentNotFoundException,
  PhdSupervisorNotFoundException,
  PhdSupervisorQuotaExceededException,
  PhdSupervisorStudentNotFoundException,
} from './supervisor.exceptions.js';

/**
 * Bảng định mức tải theo BR-09:
 * GS (GIAO_SU)           <= 7.0
 * PGS (PHO_GIAO_SU)      <= 5.0
 * TSKH (TIEN_SI_KHOA_HOC)<= 3.0  (tính như TS)
 * TS (TIEN_SI)           <= 3.0
 */
const QUOTA_MAP: Record<string, number> = {
  GIAO_SU: 7,
  PHO_GIAO_SU: 5,
  TIEN_SI_KHOA_HOC: 3,
  TIEN_SI: 3,
};

/**
 * Trọng số tính tải theo vai trò hướng dẫn:
 * HD Chính (HUONG_DAN_CHINH) = 1.0
 * Đồng HD (DONG_HUONG_DAN)   = 0.5
 */
const LOAD_WEIGHT: Record<string, number> = {
  HUONG_DAN_CHINH: 1.0,
  DONG_HUONG_DAN: 0.5,
};

@Injectable()
export class SupervisorService {
  private readonly logger = new Logger(SupervisorService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() @Inject('NOTIFICATION_SERVICE') private readonly notificationClient?: ClientProxy,
  ) {}

  // ─── [S5-13] CRUD Lý lịch khoa học GVHD ─────────────────────────────────

  /**
   * Tạo mới hồ sơ GVHD. Tự tính maxNcsChoPhep từ học hàm nếu không truyền.
   */
  async createSupervisor(actorId: string, dto: CreateSupervisorDto) {
    const maxNcs = dto.maxNcsChoPhep ?? QUOTA_MAP[dto.hocHamHocVi] ?? 3;

    const gvhd = await this.prisma.giangVienHuongDan.create({
      data: {
        maGv: dto.maGv,
        userId: dto.userId,
        hoTen: dto.hoTen,
        gioiTinh: dto.gioiTinh as any,
        ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : undefined,
        email: dto.email,
        hocHamHocVi: dto.hocHamHocVi as any,
        chuyenNganh: dto.chuyenNganh,
        quocGiaTotNghiep: dto.quocGiaTotNghiep,
        coQuanCongTac: dto.coQuanCongTac,
        donViId: dto.donViId,
        boMon: dto.boMon,
        khoa: dto.khoa,
        lichSuCongBo5Nam: dto.lichSuCongBo5Nam as any,
        maxNcsChoPhep: maxNcs,
        soNcsDangHuongDan: 0,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'SUPERVISOR_CREATE',
        entityType: 'GiangVienHuongDan',
        entityId: gvhd.id,
        newValue: { hoTen: dto.hoTen, hocHamHocVi: dto.hocHamHocVi, maxNcsChoPhep: maxNcs },
      },
    });

    return gvhd;
  }

  /**
   * Danh sách GVHD với bộ lọc.
   */
  async listSupervisors(query: QuerySupervisorsDto) {
    const where: Prisma.GiangVienHuongDanWhereInput = {};

    if (query.search) {
      where.OR = [
        { hoTen: { contains: query.search } },
        { maGv: { contains: query.search } },
      ];
    }
    if (query.hocHamHocVi) {
      where.hocHamHocVi = query.hocHamHocVi as any;
    }
    if (query.donViId) {
      where.donViId = query.donViId;
    }
    if (query.coChoTrong) {
      // Lọc những người còn chỗ trống (số NCS đang HD < định mức)
      where.soNcsDangHuongDan = { lt: this.prisma.giangVienHuongDan.fields.maxNcsChoPhep as any };
    }

    const list = await this.prisma.giangVienHuongDan.findMany({
      where,
      include: {
        donVi: { select: { id: true, ten: true, loai: true } },
        phanCongs: {
          where: { trangThai: 'DANG_HIEU_LUC' as any },
          include: {
            ncs: { select: { id: true, mshv: true, hoTen: true } },
          },
        },
      },
      orderBy: { hoTen: 'asc' },
    });

    return list.map((g) => this.formatSupervisor(g));
  }

  /**
   * Chi tiết một GVHD kèm tải hiện tại & danh sách NCS đang hướng dẫn.
   */
  async getSupervisor(id: string) {
    const g = await this.prisma.giangVienHuongDan.findUnique({
      where: { id },
      include: {
        donVi: { select: { id: true, ten: true, loai: true } },
        phanCongs: {
          where: { trangThai: 'DANG_HIEU_LUC' as any },
          include: {
            ncs: { select: { id: true, mshv: true, hoTen: true, email: true } },
            quyetDinh: { select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true } },
          },
        },
      },
    });

    if (!g) throw new PhdSupervisorNotFoundException(id);
    return this.formatSupervisor(g);
  }

  /**
   * Cập nhật thông tin GVHD. Tự cập nhật maxNcsChoPhep nếu học hàm thay đổi.
   */
  async updateSupervisor(actorId: string, id: string, dto: UpdateSupervisorDto) {
    const existing = await this.prisma.giangVienHuongDan.findUnique({ where: { id } });
    if (!existing) throw new PhdSupervisorNotFoundException(id);

    const newHocHam = dto.hocHamHocVi ?? existing.hocHamHocVi;
    const maxNcs = dto.maxNcsChoPhep ?? (dto.hocHamHocVi ? QUOTA_MAP[dto.hocHamHocVi] : undefined) ?? existing.maxNcsChoPhep;

    const updated = await this.prisma.giangVienHuongDan.update({
      where: { id },
      data: {
        hoTen: dto.hoTen,
        gioiTinh: dto.gioiTinh as any,
        ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : undefined,
        email: dto.email,
        hocHamHocVi: newHocHam as any,
        chuyenNganh: dto.chuyenNganh,
        quocGiaTotNghiep: dto.quocGiaTotNghiep,
        coQuanCongTac: dto.coQuanCongTac,
        donViId: dto.donViId,
        boMon: dto.boMon,
        khoa: dto.khoa,
        lichSuCongBo5Nam: dto.lichSuCongBo5Nam as any,
        maxNcsChoPhep: maxNcs,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        action: 'SUPERVISOR_UPDATE',
        entityType: 'GiangVienHuongDan',
        entityId: id,
        oldValue: { hocHamHocVi: existing.hocHamHocVi, maxNcsChoPhep: existing.maxNcsChoPhep },
        newValue: { hocHamHocVi: updated.hocHamHocVi, maxNcsChoPhep: updated.maxNcsChoPhep },
      },
    });

    return updated;
  }

  // ─── [S5-14] Tra cứu định mức ─────────────────────────────────────────────

  /**
   * Kiểm tra tải hiện tại và định mức của một GVHD (BR-09).
   * Tải = (NCS HD Chính * 1.0) + (NCS Đồng HD * 0.5)
   */
  async getQuotaStatus(gvhdId: string) {
    const g = await this.prisma.giangVienHuongDan.findUnique({
      where: { id: gvhdId },
      include: {
        phanCongs: {
          where: { trangThai: 'DANG_HIEU_LUC' as any },
          select: { vaiTro: true, trongSo: true },
        },
      },
    });

    if (!g) throw new PhdSupervisorNotFoundException(gvhdId);

    const computedLoad = g.phanCongs.reduce((sum, pc) => {
      const w = LOAD_WEIGHT[pc.vaiTro] ?? Number(pc.trongSo);
      return sum + w;
    }, 0);

    const cachedLoad = Number(g.soNcsDangHuongDan);
    const quota = QUOTA_MAP[g.hocHamHocVi] ?? g.maxNcsChoPhep;

    return {
      gvhdId: g.id,
      hoTen: g.hoTen,
      hocHamHocVi: g.hocHamHocVi,
      maxNcsChoPhep: g.maxNcsChoPhep,
      quotaTheoHocHam: quota,
      soNcsDangHuongDan: cachedLoad,
      computedLoad: Math.round(computedLoad * 10) / 10,
      conLai: Math.max(0, g.maxNcsChoPhep - cachedLoad),
      coChoTrong: cachedLoad < g.maxNcsChoPhep,
      chiTietPhanCong: g.phanCongs.map((pc) => ({
        vaiTro: pc.vaiTro,
        trongSo: Number(pc.trongSo),
      })),
    };
  }

  // ─── [S5-15] Phân công GVHD + Transaction + Pessimistic Lock ─────────────

  /**
   * Phân công GVHD cho NCS.
   *
   * Cơ chế chống Race Condition:
   * - Dùng Isolation Level SERIALIZABLE cho toàn transaction.
   * - Câu lệnh SELECT với FOR UPDATE (thông qua prisma.$queryRaw) để khóa
   *   hàng GVHD trong suốt transaction, buộc các request đồng thời phải xếp hàng.
   * - Sau khi lấy được lock, tính lại tải thực tế trong DB.
   * - Nếu tải mới vượt định mức → ROLLBACK và ném PHD_SUPERVISOR_QUOTA_EXCEEDED.
   * - Nếu hợp lệ → tạo PhanCongHuongDan + cập nhật soNcsDangHuongDan + ghi audit.
   */
  async assignSupervisor(actorId: string, dto: AssignSupervisorDto) {
    const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { id: dto.ncsId } });
    if (!ncs) throw new PhdSupervisorStudentNotFoundException(dto.ncsId);

    const result = await this.prisma.$transaction(
      async (tx) => {
        // ── Step 1: Pessimistic Lock hàng GVHD ──
        // Dùng raw SQL SELECT ... FOR UPDATE để khóa hàng GVHD,
        // ngăn chặn 2 transaction đồng thời đọc cùng 1 tải và cùng vượt quota.
        const [lockedGvhd] = await tx.$queryRaw<any[]>`
          SELECT id, ho_ten, hoc_ham_hoc_vi, max_ncs_cho_phep, so_ncs_dang_huong_dan, version
          FROM giang_vien_huong_dan
          WHERE id = ${dto.gvhdId}
          FOR UPDATE
        `;

        if (!lockedGvhd) throw new PhdSupervisorNotFoundException(dto.gvhdId);

        // ── Step 2: Đếm lại tải thực tế trong DB (tránh đọc giá trị cache stale) ──
        const activeAssignments = await tx.phanCongHuongDan.findMany({
          where: {
            gvhdId: dto.gvhdId,
            trangThai: 'DANG_HIEU_LUC' as any,
          },
          select: { vaiTro: true, trongSo: true },
        });

        const currentLoad = activeAssignments.reduce((sum, pc) => {
          return sum + (LOAD_WEIGHT[pc.vaiTro] ?? Number(pc.trongSo));
        }, 0);

        // ── Step 3: Tính tải mới sau khi thêm phân công hiện tại ──
        const addedWeight = LOAD_WEIGHT[dto.vaiTro] ?? 1.0;
        const newLoad = currentLoad + addedWeight;
        const maxAllowed = lockedGvhd.max_ncs_cho_phep;

        if (newLoad > maxAllowed) {
          // ROLLBACK: ném exception để Prisma $transaction tự rollback
          throw new PhdSupervisorQuotaExceededException(
            lockedGvhd.ho_ten,
            Math.round(currentLoad * 10) / 10,
            maxAllowed,
          );
        }

        // ── Step 4: Tạo quyết định phân công ──
        const quyetDinh = await tx.quyetDinh.create({
          data: {
            ncsId: dto.ncsId,
            loai: 'PHAN_CONG_GVHD' as any,
            soQuyetDinh: dto.soQuyetDinh,
            ngayQuyetDinh: new Date(dto.ngayQuyetDinh),
            fileId: dto.fileId,
            ghiChu: dto.ghiChu,
            nguoiTaoId: actorId,
            trangThai: 'HIEU_LUC' as any,
          },
        });

        // ── Step 5: Tạo bản ghi phân công ──
        const phanCong = await tx.phanCongHuongDan.create({
          data: {
            ncsId: dto.ncsId,
            gvhdId: dto.gvhdId,
            vaiTro: dto.vaiTro as any,
            trongSo: addedWeight,
            quyetDinhId: quyetDinh.id,
            trangThai: 'DANG_HIEU_LUC' as any,
            ngayBatDau: dto.ngayBatDau ? new Date(dto.ngayBatDau) : new Date(dto.ngayQuyetDinh),
          },
        });

        // ── Step 6: Cập nhật bộ đếm tải + version (optimistic lock guard) ──
        await tx.giangVienHuongDan.update({
          where: {
            id: dto.gvhdId,
            version: lockedGvhd.version, // optimistic lock
          },
          data: {
            soNcsDangHuongDan: Math.round(newLoad * 10) / 10,
            version: { increment: 1 },
          },
        });

        // ── Step 7: Audit log ──
        await tx.auditLog.create({
          data: {
            actorId,
            action: 'SUPERVISOR_ASSIGN',
            entityType: 'PhanCongHuongDan',
            entityId: phanCong.id,
            ncsId: dto.ncsId,
            newValue: {
              gvhdId: dto.gvhdId,
              vaiTro: dto.vaiTro,
              loadBefore: Math.round(currentLoad * 10) / 10,
              loadAfter: Math.round(newLoad * 10) / 10,
              soQuyetDinh: dto.soQuyetDinh,
            },
          },
        });

        return {
          phanCong,
          quyetDinh,
          loadAfter: Math.round(newLoad * 10) / 10,
          maxAllowed,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 10000,
      },
    );

    // ─── [S5-22] Bắn Event TCP cho notification-service ─────────────────────
    this.emitSupervisorAssignedEvent({
      actorId,
      ncsId: dto.ncsId,
      assignmentId: result.phanCong.id,
      gvhdId: dto.gvhdId,
      vaiTro: dto.vaiTro,
      trongSo: LOAD_WEIGHT[dto.vaiTro] ?? 1.0,
      quyetDinhId: result.quyetDinh.id,
      soQuyetDinh: dto.soQuyetDinh,
    });

    return result;
  }

  /**
   * Thay đổi GVHD (BR-04):
   * - DEACTIVATE phân công cũ (không xóa, chỉ đổi trạng thái).
   * - Giảm tải GVHD cũ.
   * - Phân công GVHD mới với kiểm tra quota.
   * Toàn bộ trong một transaction SERIALIZABLE.
   */
  async changeSupervisor(actorId: string, dto: ChangeSupervisorDto) {
    const ncs = await this.prisma.nghienCuuSinh.findUnique({ where: { id: dto.ncsId } });
    if (!ncs) throw new PhdSupervisorStudentNotFoundException(dto.ncsId);

    return this.prisma.$transaction(
      async (tx) => {
        // ── Lấy phân công cũ ──
        const oldAssignment = await tx.phanCongHuongDan.findUnique({
          where: { id: dto.phanCongCuId },
          include: { gvhd: true },
        });
        if (!oldAssignment) throw new PhdSupervisorAssignmentNotFoundException(dto.phanCongCuId);

        // ── Pessimistic Lock GVHD cũ + GVHD mới ──
        const [lockedOldGvhd] = await tx.$queryRaw<any[]>`
          SELECT id, ho_ten, hoc_ham_hoc_vi, max_ncs_cho_phep, so_ncs_dang_huong_dan, version
          FROM giang_vien_huong_dan
          WHERE id = ${oldAssignment.gvhdId}
          FOR UPDATE
        `;
        const [lockedNewGvhd] = await tx.$queryRaw<any[]>`
          SELECT id, ho_ten, hoc_ham_hoc_vi, max_ncs_cho_phep, so_ncs_dang_huong_dan, version
          FROM giang_vien_huong_dan
          WHERE id = ${dto.gvhdMoiId}
          FOR UPDATE
        `;
        if (!lockedNewGvhd) throw new PhdSupervisorNotFoundException(dto.gvhdMoiId);

        // ── Kiểm tra quota GVHD mới ──
        const newGvhdAssignments = await tx.phanCongHuongDan.findMany({
          where: { gvhdId: dto.gvhdMoiId, trangThai: 'DANG_HIEU_LUC' as any },
          select: { vaiTro: true, trongSo: true },
        });
        const newGvhdCurrentLoad = newGvhdAssignments.reduce(
          (s, pc) => s + (LOAD_WEIGHT[pc.vaiTro] ?? Number(pc.trongSo)),
          0,
        );
        const addedWeight = LOAD_WEIGHT[dto.vaiTro] ?? 1.0;
        const projectedLoad = newGvhdCurrentLoad + addedWeight;

        if (projectedLoad > lockedNewGvhd.max_ncs_cho_phep) {
          throw new PhdSupervisorQuotaExceededException(
            lockedNewGvhd.ho_ten,
            Math.round(newGvhdCurrentLoad * 10) / 10,
            lockedNewGvhd.max_ncs_cho_phep,
          );
        }

        // ── BR-04: DEACTIVATE phân công cũ (không hard-delete) ──
        const oldWeight = LOAD_WEIGHT[oldAssignment.vaiTro] ?? Number(oldAssignment.trongSo);
        await tx.phanCongHuongDan.update({
          where: { id: dto.phanCongCuId },
          data: {
            trangThai: 'DEACTIVATE' as any,
            ngayKetThuc: new Date(),
          },
        });

        // ── Giảm tải GVHD cũ ──
        const oldNewLoad = Math.max(0, Number(lockedOldGvhd.so_ncs_dang_huong_dan) - oldWeight);
        await tx.giangVienHuongDan.update({
          where: { id: oldAssignment.gvhdId, version: lockedOldGvhd.version },
          data: {
            soNcsDangHuongDan: Math.round(oldNewLoad * 10) / 10,
            version: { increment: 1 },
          },
        });

        // ── Tạo quyết định mới ──
        const quyetDinh = await tx.quyetDinh.create({
          data: {
            ncsId: dto.ncsId,
            loai: 'PHAN_CONG_GVHD' as any,
            soQuyetDinh: dto.soQuyetDinh,
            ngayQuyetDinh: new Date(dto.ngayQuyetDinh),
            fileId: dto.fileId,
            ghiChu: dto.ghiChu ?? `Thay đổi GVHD: ${dto.lyDo}`,
            nguoiTaoId: actorId,
            trangThai: 'HIEU_LUC' as any,
          },
        });

        // ── Tạo phân công mới ──
        const newAssignment = await tx.phanCongHuongDan.create({
          data: {
            ncsId: dto.ncsId,
            gvhdId: dto.gvhdMoiId,
            vaiTro: dto.vaiTro as any,
            trongSo: addedWeight,
            quyetDinhId: quyetDinh.id,
            trangThai: 'DANG_HIEU_LUC' as any,
            ngayBatDau: new Date(dto.ngayQuyetDinh),
          },
        });

        // ── Tăng tải GVHD mới ──
        await tx.giangVienHuongDan.update({
          where: { id: dto.gvhdMoiId, version: lockedNewGvhd.version },
          data: {
            soNcsDangHuongDan: Math.round(projectedLoad * 10) / 10,
            version: { increment: 1 },
          },
        });

        // ── Audit log ──
        await tx.auditLog.create({
          data: {
            actorId,
            action: 'SUPERVISOR_CHANGE',
            entityType: 'PhanCongHuongDan',
            entityId: newAssignment.id,
            ncsId: dto.ncsId,
            oldValue: {
              phanCongCuId: dto.phanCongCuId,
              gvhdCuId: oldAssignment.gvhdId,
              lyDo: dto.lyDo,
            },
            newValue: {
              phanCongMoiId: newAssignment.id,
              gvhdMoiId: dto.gvhdMoiId,
              vaiTro: dto.vaiTro,
              soQuyetDinh: dto.soQuyetDinh,
            },
          },
        });

        return {
          deactivatedAssignment: dto.phanCongCuId,
          newAssignment,
          quyetDinh,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 10000,
      },
    );
  }

  /**
   * Danh sách phân công hướng dẫn (có thể lọc theo NCS, GVHD, trạng thái).
   */
  async listAssignments(query: QueryAssignmentsDto) {
    const where: Prisma.PhanCongHuongDanWhereInput = {};
    if (query.ncsId) where.ncsId = query.ncsId;
    if (query.gvhdId) where.gvhdId = query.gvhdId;
    if (query.trangThai) where.trangThai = query.trangThai as any;
    if (query.vaiTro) where.vaiTro = query.vaiTro as any;

    return this.prisma.phanCongHuongDan.findMany({
      where,
      include: {
        ncs: { select: { id: true, mshv: true, hoTen: true } },
        gvhd: { select: { id: true, hoTen: true, hocHamHocVi: true, coQuanCongTac: true } },
        quyetDinh: { select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private formatSupervisor(g: any) {
    const currentLoad = Number(g.soNcsDangHuongDan ?? 0);
    const quota = QUOTA_MAP[g.hocHamHocVi] ?? g.maxNcsChoPhep;
    return {
      id: g.id,
      maGv: g.maGv,
      hoTen: g.hoTen,
      gioiTinh: g.gioiTinh,
      email: g.email,
      hocHamHocVi: g.hocHamHocVi,
      chuyenNganh: g.chuyenNganh,
      quocGiaTotNghiep: g.quocGiaTotNghiep,
      coQuanCongTac: g.coQuanCongTac,
      donVi: g.donVi ?? null,
      boMon: g.boMon,
      khoa: g.khoa,
      lichSuCongBo5Nam: g.lichSuCongBo5Nam,
      maxNcsChoPhep: g.maxNcsChoPhep,
      quotaTheoHocHam: quota,
      soNcsDangHuongDan: currentLoad,
      conLai: Math.max(0, g.maxNcsChoPhep - currentLoad),
      coChoTrong: currentLoad < g.maxNcsChoPhep,
      ncsDangHuongDan: (g.phanCongs ?? []).map((pc: any) => ({
        phanCongId: pc.id,
        ncs: pc.ncs,
        vaiTro: pc.vaiTro,
        trongSo: Number(pc.trongSo),
        ngayBatDau: pc.ngayBatDau,
        quyetDinh: pc.quyetDinh ?? null,
      })),
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    };
  }

  // ─── [S5-22] Helper phát Event TCP sang notification-service ────────────────

  private emitSupervisorAssignedEvent(params: {
    actorId: string;
    ncsId: string;
    correlationId?: string;
    assignmentId: string;
    gvhdId: string;
    vaiTro: string;
    trongSo: number;
    quyetDinhId: string;
    soQuyetDinh: string;
  }) {
    if (!this.notificationClient) {
      this.logger.debug('NotificationClient không được cấu hình. Bỏ qua phát TCP Event.');
      return;
    }

    const payload: PhdEventPayload = {
      eventId: randomUUID(),
      eventType: 'phd.supervisor.assigned',
      occurredAt: new Date().toISOString(),
      actorId: params.actorId,
      ncsId: params.ncsId,
      correlationId: params.correlationId,
      data: {
        assignmentId: params.assignmentId,
        gvhdId: params.gvhdId,
        vaiTro: params.vaiTro,
        trongSo: params.trongSo,
        quyetDinhId: params.quyetDinhId,
        soQuyetDinh: params.soQuyetDinh,
      },
    };

    try {
      this.notificationClient.emit('phd.supervisor.assigned', payload);
      this.logger.log(`[EVENT] Đã phát sự kiện phd.supervisor.assigned: ${payload.eventId}`);
    } catch (err: any) {
      this.logger.warn(`Không thể phát TCP Event phd.supervisor.assigned: ${err?.message}`);
    }
  }
}

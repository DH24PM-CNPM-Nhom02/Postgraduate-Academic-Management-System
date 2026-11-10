import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { AssignThesisDto, DeactivateThesisAssignmentDto, ThesisListQueryDto } from '../../../../lib/contracts/src/dto/thesis.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationClient } from '../notification/notification.client.js';

@Injectable()
export class ThesisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly thongBao: NotificationClient,
  ) { }

  async assign(actorId: string, dto: AssignThesisDto) {
    const tenDeTai = dto.tenDeTai.trim();
    if (!tenDeTai) {
      throw new RpcException({ statusCode: 400, message: 'Tên đề tài không được để trống' });
    }

    return this.prisma.$transaction(async (tx) => {
      const ncs = await tx.nghienCuuSinh.findUnique({
        where: { id: dto.ncsId },
        select: { id: true, trangThai: true, userId: true, hoTen: true, mshv: true },
      });
      if (!ncs) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy NCS' });
      if (ncs.trangThai !== 'DANG_HOC' && ncs.trangThai !== 'GIA_HAN') {
        throw new RpcException({ statusCode: 400, message: 'NCS không ở trạng thái được phép giao đề tài' });
      }

      const quyetDinh = await tx.quyetDinh.findUnique({
        where: { id: dto.quyetDinhId },
        select: { id: true, ncsId: true, loai: true, trangThai: true, soQuyetDinh: true, ngayQuyetDinh: true },
      });
      if (!quyetDinh) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy quyết định' });
      if (quyetDinh.loai !== 'GIAO_DE_TAI' || quyetDinh.trangThai !== 'HIEU_LUC') {
        throw new RpcException({ statusCode: 400, message: 'Quyết định phải thuộc loại GIAO_DE_TAI và đang còn hiệu lực' });
      }
      if (quyetDinh.ncsId !== dto.ncsId) {
        throw new RpcException({ statusCode: 400, message: 'Quyết định không áp dụng cho NCS này' });
      }

      const deTaiHienTai = await tx.deTai.findFirst({
        where: { ncsId: dto.ncsId, trangThai: 'HIEU_LUC' },
        select: { id: true },
      });
      if (deTaiHienTai) {
        throw new RpcException({ statusCode: 409, message: 'NCS đã có đề tài đang hiệu lực' });
      }

      const deNghiDangCho = await tx.deNghiDieuChinh.findFirst({
        where: { ncsId: dto.ncsId, trangThai: 'CHO_DUYET' },
        select: { id: true },
      });
      if (deNghiDangCho) {
        throw new RpcException({ statusCode: 409, message: 'NCS đang có đề nghị điều chỉnh chờ duyệt, không thể giao đề tài lúc này' });
      }

      const quyetDinhDaDung = await tx.deTai.findFirst({
        where: { quyetDinhId: dto.quyetDinhId, trangThai: 'HIEU_LUC' },
        select: { id: true },
      });
      if (quyetDinhDaDung) {
        throw new RpcException({ statusCode: 409, message: 'Quyết định này đã gắn với một đề tài đang hiệu lực' });
      }

      const phanCongs = await tx.phanCongHuongDan.findMany({
        where: { ncsId: dto.ncsId, trangThai: 'DANG_HIEU_LUC' },
        include: { gvhd: { select: { userId: true } } },
      });

      const deTai = await tx.deTai.create({
        data: {
          ncsId: dto.ncsId,
          tenDeTai,
          quyetDinhId: dto.quyetDinhId,
          trangThai: 'HIEU_LUC',
        },
      });

      await tx.auditLog.create({
        data: {
          actorId,
          action: 'THESIS_ASSIGN',
          entityType: 'DeTai',
          entityId: deTai.id,
          ncsId: dto.ncsId,
          oldValue: {},
          newValue: { tenDeTai, quyetDinhId: dto.quyetDinhId, trangThai: 'HIEU_LUC' },
        },
      });

      const gvhdUserIds = [...new Set(
        phanCongs
          .map((phanCong) => phanCong.gvhd?.userId)
          .filter((userId): userId is string => Boolean(userId)),
      )];
      if (ncs.userId) {
        this.thongBao.gui({
          userIds: [ncs.userId],
          loai: 'NCS_DUOC_GIAO_DE_TAI',
          duLieu: {
            tenDeTai,
            soQuyetDinh: quyetDinh.soQuyetDinh,
            ngayQuyetDinh: quyetDinh.ngayQuyetDinh,
          },
          khoaTrung: `THESIS_ASSIGN:${deTai.id}`,
        });
      }
      this.thongBao.gui({
        userIds: gvhdUserIds,
        loai: 'GVHD_NCS_DUOC_GIAO_DE_TAI',
        duLieu: {
          tenNcs: ncs.hoTen,
          mshv: ncs.mshv,
          tenDeTai,
          soQuyetDinh: quyetDinh.soQuyetDinh,
          ngayQuyetDinh: quyetDinh.ngayQuyetDinh,
        },
        khoaTrung: `THESIS_ASSIGN_GVHD:${deTai.id}`,
      });

      return deTai;
    });
  }

  async deactivate(actorId: string, id: string, data: DeactivateThesisAssignmentDto) {
    const { lyDo } = data;
    const lyDoDaChuanHoa = lyDo?.trim();
    if (!lyDoDaChuanHoa) {
      throw new RpcException({ statusCode: 400, message: 'Lý do hủy đề tài là bắt buộc' });
    }

    return this.prisma.$transaction(async (tx) => {
      const deTai = await tx.deTai.findUnique({ where: { id } });
      if (!deTai) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy đề tài' });
      if (deTai.trangThai !== 'HIEU_LUC') {
        throw new RpcException({ statusCode: 400, message: 'Chỉ được hủy đề tài đang hiệu lực' });
      }

      const deNghiDangCho = await tx.deNghiDieuChinh.findFirst({
        where: { ncsId: deTai.ncsId, trangThai: 'CHO_DUYET' },
        select: { id: true },
      });
      if (deNghiDangCho) {
        throw new RpcException({ statusCode: 409, message: 'NCS đang có đề nghị điều chỉnh chờ duyệt, không thể hủy đề tài lúc này' });
      }

      const ncs = await tx.nghienCuuSinh.findUnique({
        where: { id: deTai.ncsId },
        select: {
          userId: true,
          hoTen: true,
          mshv: true,
          phanCongs: {
            where: { trangThai: 'DANG_HIEU_LUC' },
            include: { gvhd: { select: { userId: true } } },
          },
        },
      });

      const ngayKetThuc = new Date();
      const updated = await tx.deTai.update({
        where: { id },
        data: { trangThai: 'DA_HUY', ngayKetThuc },
        include: { quyetDinh: { select: { id: true, soQuyetDinh: true, ngayQuyetDinh: true } } },
      });

      await tx.auditLog.create({
        data: {
          actorId,
          action: 'THESIS_CANCEL',
          entityType: 'DeTai',
          entityId: id,
          ncsId: deTai.ncsId,
          oldValue: { trangThai: deTai.trangThai, ngayKetThuc: deTai.ngayKetThuc },
          newValue: { trangThai: 'DA_HUY', ngayKetThuc, lyDo: lyDoDaChuanHoa },
        },
      });

      const gvhdUserIds = [...new Set(
        ncs?.phanCongs
          .map((phanCong) => phanCong.gvhd?.userId)
          .filter((userId): userId is string => Boolean(userId)) ?? [],
      )];
      const duLieuThongBao = {
        tenNcs: ncs?.hoTen,
        mshv: ncs?.mshv,
        tenDeTai: deTai.tenDeTai,
        lyDo: lyDoDaChuanHoa,
      };
      if (ncs?.userId) {
        this.thongBao.gui({
          userIds: [ncs.userId],
          loai: 'NCS_DE_TAI_BI_HUY',
          duLieu: duLieuThongBao,
          khoaTrung: `THESIS_DEACTIVATE:${deTai.id}:NCS`,
        });
      }
      this.thongBao.gui({
        userIds: gvhdUserIds,
        loai: 'GVHD_DE_TAI_NCS_BI_HUY',
        duLieu: duLieuThongBao,
        khoaTrung: `THESIS_DEACTIVATE:${deTai.id}:GVHD`,
      });

      return updated;
    });
  }

  async list(query: ThesisListQueryDto) {
    const deTaiStatus = query.trangThai && query.trangThai !== 'CHUA_GIAO'
      ? query.trangThai as 'HIEU_LUC' | 'DA_THAY_THE' | 'DA_HUY'
      : undefined;
    const ncss = await this.prisma.nghienCuuSinh.findMany({
      where: {
        khoaHocId: query.khoaHocId,
        AND: [
          query.gvhdId
            ? { phanCongs: { some: { gvhdId: query.gvhdId, trangThai: 'DANG_HIEU_LUC' } } }
            : {},
          deTaiStatus
            ? { deTais: { some: { trangThai: deTaiStatus } } }
            : {},
          query.trangThai === 'CHUA_GIAO'
            ? { deTais: { none: { trangThai: 'HIEU_LUC' } } }
            : {},
        ],
      },
      select: {
        id: true,
        mshv: true,
        hoTen: true,
        khoaHoc: true,
        deTais: {
          include: { quyetDinh: { select: { soQuyetDinh: true, ngayQuyetDinh: true } } },
          orderBy: { createdAt: 'desc' },
        },
        phanCongs: {
          where: { trangThai: 'DANG_HIEU_LUC' },
          include: {
            gvhd: { select: { id: true, hoTen: true } },
            quyetDinh: { select: { soQuyetDinh: true, ngayQuyetDinh: true } },
          },
        },
      },
      orderBy: { hoTen: 'asc' },
    });

    return ncss.map((ncs) => ({
      ...ncs,
      trangThaiDeTai: ncs.deTais.find((deTai) => deTai.trangThai === 'HIEU_LUC')?.trangThai ?? 'CHUA_GIAO',
      deTaiHienTai: ncs.deTais.find((deTai) => deTai.trangThai === 'HIEU_LUC') ?? null,
    }));
  }

  async detail(ncsId: string) {
    const ncs = await this.prisma.nghienCuuSinh.findUnique({
      where: { id: ncsId },
      select: {
        id: true,
        mshv: true,
        hoTen: true,
        khoaHoc: true,
        deTais: {
          include: { quyetDinh: { select: { soQuyetDinh: true, ngayQuyetDinh: true } } },
          orderBy: { createdAt: 'desc' },
        },
        phanCongs: {
          include: {
            gvhd: { select: { id: true, hoTen: true, hocHamHocVi: true, email: true, maGv: true } },
            quyetDinh: { select: { soQuyetDinh: true, ngayQuyetDinh: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!ncs) throw new RpcException({ statusCode: 404, message: 'Không tìm thấy NCS' });
    return {
      ...ncs,
      deTaiHienTai: ncs.deTais.find((deTai) => deTai.trangThai === 'HIEU_LUC') ?? null,
      phanCongsHienTai: ncs.phanCongs.filter((pc) => pc.trangThai === 'DANG_HIEU_LUC'),
    };
  }

  async getMyThesisAndSupervisors(userId: string) {
    const ncs = await this.prisma.nghienCuuSinh.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!ncs) {
      throw new RpcException({ statusCode: 404, message: 'Bạn chưa có hồ sơ NCS' });
    }
    return this.detail(ncs.id);
  }

}

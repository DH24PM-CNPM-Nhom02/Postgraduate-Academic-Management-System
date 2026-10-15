import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import {
  ApproveEvaluationDto,
  AssignEvaluatorsDto,
  CreateEvaluationFormDto,
  CreateEvaluationSessionDto,
  QueryEvaluationSessionsDto,
  UpdateEvaluationFormDto,
} from '../../../../lib/contracts/src/dto/evaluation.dto.js';
import {
  LoaiQuyetDinh,
  TrangThaiMinhChung,
  TrangThaiMoc,
  TrangThaiQuyetDinh,
} from '../generated/prisma/index.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  PhdEvaluationCannotDeleteSubmittedException,
  PhdEvaluationFormAlreadySubmittedException,
  PhdEvaluationFormNotFoundException,
  PhdEvaluationNotEnoughFormsException,
  PhdEvaluationScoreInvalidException,
  PhdEvaluationSessionNotFoundException,
  PhdMilestoneNotFoundException,
  PhdScoreDifferenceExceededException,
  PhdStudentNotFoundException,
} from './evaluation.exceptions.js';
import {
  calculateEvaluationSummary,
  deserializeFormContent,
  serializeFormContent,
  validateEvaluationScore,
} from './evaluation.util.js';

@Injectable()
export class EvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper: Parse danh sách người chấm từ trường ghiChu của Quyết định thành lập hội đồng.
   */
  private parseEvaluators(raw?: string | null): any[] {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.evaluators)) return parsed.evaluators;
    } catch {
      // Bỏ qua nếu không phải JSON
    }
    return [];
  }

  /**
   * Helper: Format đối tượng phiếu nhận xét trả về cho client.
   */
  private formatForm(form: any, sessionId?: string) {
    const meta = deserializeFormContent(form.nhanXet);
    const scoreNum =
      typeof form.diem === 'number'
        ? form.diem
        : typeof form.diem?.toNumber === 'function'
        ? form.diem.toNumber()
        : Number(form.diem);

    return {
      id: form.id,
      sessionId: sessionId || form.minhChungId,
      minhChungId: form.minhChungId,
      tenNguoiCham: form.tenNguoiCham,
      donViNguoiCham: form.donViNguoiCham,
      diem: scoreNum,
      comment: meta.comment,
      strengths: meta.strengths,
      weaknesses: meta.weaknesses,
      isDraft: meta.isDraft,
      status: meta.status,
      nhapBoiId: form.nhapBoiId,
      createdAt: form.createdAt,
    };
  }

  /**
   * [S5-02] Danh sách các đợt chấm điểm (evaluation sessions).
   */
  async listSessions(query: QueryEvaluationSessionsDto) {
    const where: any = {};

    if (query.ncsId) {
      where.tienTrinh = { ...where.tienTrinh, ncsId: query.ncsId };
    }
    if (query.mocId) {
      where.tienTrinh = { ...where.tienTrinh, mocId: Number(query.mocId) };
    }
    if (query.trangThai) {
      where.trangThai = query.trangThai as TrangThaiMinhChung;
    }

    const sessions = await this.prisma.minhChungMoc.findMany({
      where,
      include: {
        tienTrinh: {
          include: {
            moc: true,
            ncs: {
              select: {
                id: true,
                mshv: true,
                hoTen: true,
                email: true,
                lop: true,
              },
            },
          },
        },
        quyetDinh: true,
        phieuNhanXets: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map((s) => {
      const assignedEvaluators = this.parseEvaluators(s.quyetDinh?.ghiChu);
      const formattedForms = s.phieuNhanXets.map((f) => this.formatForm(f, s.id));
      const summary = calculateEvaluationSummary(formattedForms, assignedEvaluators.length);

      return {
        id: s.id,
        ncsId: s.tienTrinh.ncsId,
        ncs: s.tienTrinh.ncs,
        mocId: s.tienTrinh.mocId,
        milestone: {
          id: s.tienTrinh.moc.id,
          thuTu: s.tienTrinh.moc.thuTu,
          tenMoc: s.tienTrinh.moc.tenMoc,
          yeuCauDiem: s.tienTrinh.moc.yeuCauDiem,
        },
        round: s.lanNop,
        fileId: s.fileId,
        status: s.trangThai,
        diemTrungBinh: s.diemTrungBinh ? Number(s.diemTrungBinh) : summary.averageScore,
        lyDoTuChoi: s.lyDoTuChoi,
        assignedEvaluators,
        assignedCount: assignedEvaluators.length,
        submittedCount: summary.submittedCount,
        draftCount: summary.draftCount,
        summary,
        quyetDinh: s.quyetDinh
          ? {
              id: s.quyetDinh.id,
              soQuyetDinh: s.quyetDinh.soQuyetDinh,
              ngayQuyetDinh: s.quyetDinh.ngayQuyetDinh,
            }
          : null,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      };
    });
  }

  /**
   * [S5-02] Chi tiết một đợt chấm điểm kèm danh sách người chấm và các phiếu nhận xét.
   */
  async getSession(id: string) {
    const s = await this.prisma.minhChungMoc.findUnique({
      where: { id },
      include: {
        tienTrinh: {
          include: {
            moc: true,
            ncs: {
              select: {
                id: true,
                mshv: true,
                hoTen: true,
                email: true,
                lop: true,
              },
            },
          },
        },
        quyetDinh: true,
        phieuNhanXets: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!s) {
      throw new PhdEvaluationSessionNotFoundException(id);
    }

    const assignedEvaluators = this.parseEvaluators(s.quyetDinh?.ghiChu);
    const forms = s.phieuNhanXets.map((f) => this.formatForm(f, s.id));
    const summary = calculateEvaluationSummary(forms, assignedEvaluators.length);

    return {
      id: s.id,
      ncsId: s.tienTrinh.ncsId,
      ncs: s.tienTrinh.ncs,
      mocId: s.tienTrinh.mocId,
      milestone: {
        id: s.tienTrinh.moc.id,
        thuTu: s.tienTrinh.moc.thuTu,
        tenMoc: s.tienTrinh.moc.tenMoc,
        yeuCauDiem: s.tienTrinh.moc.yeuCauDiem,
      },
      round: s.lanNop,
      fileId: s.fileId,
      status: s.trangThai,
      diemTrungBinh: s.diemTrungBinh ? Number(s.diemTrungBinh) : summary.averageScore,
      lyDoTuChoi: s.lyDoTuChoi,
      ghiChu: s.ghiChuNcs,
      assignedEvaluators,
      forms,
      summary,
      quyetDinh: s.quyetDinh
        ? {
            id: s.quyetDinh.id,
            soQuyetDinh: s.quyetDinh.soQuyetDinh,
            ngayQuyetDinh: s.quyetDinh.ngayQuyetDinh,
            fileId: s.quyetDinh.fileId,
          }
        : null,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  }

  /**
   * [S5-02] Khởi tạo đợt chấm điểm mới (evaluation session).
   */
  async createSession(actorId: string, dto: CreateEvaluationSessionDto) {
    const student = await this.prisma.nghienCuuSinh.findUnique({
      where: { id: dto.ncsId },
    });
    if (!student) {
      throw new PhdStudentNotFoundException(dto.ncsId);
    }

    const milestone = await this.prisma.mocTienTrinh.findUnique({
      where: { id: Number(dto.mocId) },
    });
    if (!milestone) {
      throw new PhdMilestoneNotFoundException(dto.mocId);
    }

    let tienTrinh = await this.prisma.tienTrinhNcs.findUnique({
      where: {
        ncsId_mocId: {
          ncsId: dto.ncsId,
          mocId: milestone.id,
        },
      },
    });

    if (!tienTrinh) {
      tienTrinh = await this.prisma.tienTrinhNcs.create({
        data: {
          ncsId: dto.ncsId,
          mocId: milestone.id,
          trangThai: TrangThaiMoc.UNLOCKED,
          openedAt: new Date(),
        },
      });
    }

    if (tienTrinh.trangThai === TrangThaiMoc.LOCKED) {
      throw new RpcException({
        statusCode: 400,
        message: 'Mốc tiến trình chưa được mở khóa (LOCKED)',
      });
    }

    if (tienTrinh.trangThai === TrangThaiMoc.PASSED) {
      throw new RpcException({
        statusCode: 400,
        message: 'Mốc tiến trình đã hoàn thành đạt yêu cầu (PASSED)',
      });
    }

    const lastMinhChung = await this.prisma.minhChungMoc.findFirst({
      where: { tienTrinhId: tienTrinh.id },
      orderBy: { lanNop: 'desc' },
    });

    const nextLanNop = dto.lanNop ?? (lastMinhChung ? lastMinhChung.lanNop + 1 : 1);
    const sessionId = randomUUID();
    const evaluators = dto.evaluators || [];

    const result = await this.prisma.$transaction(async (tx) => {
      // Nếu mốc đang UNLOCKED, chuyển sang PENDING_REVIEW khi bắt đầu đợt chấm
      if (tienTrinh.trangThai === TrangThaiMoc.UNLOCKED || tienTrinh.trangThai === TrangThaiMoc.REJECTED) {
        await tx.tienTrinhNcs.update({
          where: { id: tienTrinh.id },
          data: {
            trangThai: TrangThaiMoc.PENDING_REVIEW,
            submittedAt: new Date(),
            version: { increment: 1 },
          },
        });
      }

      let quyetDinhId: string | null = null;
      if (dto.soQuyetDinh || evaluators.length > 0) {
        const soQd = dto.soQuyetDinh || `QĐ-HĐ-${Date.now()}`;
        const qd = await tx.quyetDinh.create({
          data: {
            ncsId: dto.ncsId,
            loai: LoaiQuyetDinh.THANH_LAP_TIEU_BAN,
            soQuyetDinh: soQd,
            ngayQuyetDinh: dto.ngayQuyetDinh ? new Date(dto.ngayQuyetDinh) : new Date(),
            trangThai: TrangThaiQuyetDinh.HIEU_LUC,
            ghiChu: JSON.stringify(evaluators),
            nguoiTaoId: actorId,
          },
        });
        quyetDinhId = qd.id;
      }

      const minhChung = await tx.minhChungMoc.create({
        data: {
          id: sessionId,
          tienTrinhId: tienTrinh.id,
          lanNop: nextLanNop,
          fileId: dto.fileId || `eval-session-${sessionId}`,
          ghiChuNcs: dto.ghiChu,
          trangThai: TrangThaiMinhChung.PENDING_REVIEW,
          quyetDinhId,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId,
          action: 'EVALUATION_SESSION_CREATE',
          entityType: 'MinhChungMoc',
          entityId: minhChung.id,
          ncsId: dto.ncsId,
          newValue: {
            sessionId: minhChung.id,
            mocId: milestone.id,
            tenMoc: milestone.tenMoc,
            lanNop: nextLanNop,
            assignedCount: evaluators.length,
          },
        },
      });

      return minhChung;
    });

    return this.getSession(result.id);
  }

  /**
   * [S5-02] Phân công người chấm / thành viên hội đồng cho đợt chấm.
   */
  async assignEvaluators(actorId: string, sessionId: string, dto: AssignEvaluatorsDto) {
    const s = await this.prisma.minhChungMoc.findUnique({
      where: { id: sessionId },
      include: {
        tienTrinh: true,
        quyetDinh: true,
      },
    });

    if (!s) {
      throw new PhdEvaluationSessionNotFoundException(sessionId);
    }

    const evaluators = dto.evaluators || [];

    await this.prisma.$transaction(async (tx) => {
      let qdId = s.quyetDinhId;

      if (qdId && s.quyetDinh) {
        await tx.quyetDinh.update({
          where: { id: qdId },
          data: {
            soQuyetDinh: dto.soQuyetDinh || s.quyetDinh.soQuyetDinh,
            ngayQuyetDinh: dto.ngayQuyetDinh ? new Date(dto.ngayQuyetDinh) : s.quyetDinh.ngayQuyetDinh,
            ghiChu: JSON.stringify(evaluators),
          },
        });
      } else {
        const createdQd = await tx.quyetDinh.create({
          data: {
            ncsId: s.tienTrinh.ncsId,
            loai: LoaiQuyetDinh.THANH_LAP_TIEU_BAN,
            soQuyetDinh: dto.soQuyetDinh || `QĐ-HĐ-${Date.now()}`,
            ngayQuyetDinh: dto.ngayQuyetDinh ? new Date(dto.ngayQuyetDinh) : new Date(),
            ghiChu: JSON.stringify(evaluators),
            nguoiTaoId: actorId,
          },
        });
        qdId = createdQd.id;

        await tx.minhChungMoc.update({
          where: { id: sessionId },
          data: { quyetDinhId: qdId },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId,
          action: 'EVALUATION_ASSIGN',
          entityType: 'MinhChungMoc',
          entityId: sessionId,
          ncsId: s.tienTrinh.ncsId,
          newValue: {
            assignedEvaluators: evaluators as any,
            count: evaluators.length,
          },
        },
      });
    });

    return this.getSession(sessionId);
  }

  /**
   * [S5-03, S5-04] Lập phiếu nhận xét online (hỗ trợ lưu nháp và nộp chính thức).
   */
  async createForm(actorId: string, sessionId: string, dto: CreateEvaluationFormDto) {
    const s = await this.prisma.minhChungMoc.findUnique({
      where: { id: sessionId },
      include: { tienTrinh: true },
    });

    if (!s) {
      throw new PhdEvaluationSessionNotFoundException(sessionId);
    }

    if (s.trangThai === TrangThaiMinhChung.PASSED) {
      throw new RpcException({
        statusCode: 400,
        message: 'Đợt chấm điểm đã hoàn tất phê duyệt, không thể nộp thêm phiếu',
      });
    }

    // [S5-04] Validate điểm số: Thang điểm 0.0 - 10.0 (tối đa 1 chữ số thập phân)
    if (!validateEvaluationScore(dto.diem)) {
      throw new PhdEvaluationScoreInvalidException();
    }

    const isDraft = !!dto.isDraft;
    const serializedNhanXet = serializeFormContent({
      isDraft,
      comment: dto.nhanXet,
      strengths: dto.strengths,
      weaknesses: dto.weaknesses,
    });

    const form = await this.prisma.$transaction(async (tx) => {
      const created = await tx.phieuNhanXet.create({
        data: {
          minhChungId: sessionId,
          tenNguoiCham: dto.tenNguoiCham,
          donViNguoiCham: dto.donViNguoiCham,
          diem: dto.diem,
          nhanXet: serializedNhanXet,
          nhapBoiId: actorId,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId,
          action: isDraft ? 'EVALUATION_FORM_DRAFT' : 'EVALUATION_FORM_SUBMIT',
          entityType: 'PhieuNhanXet',
          entityId: created.id,
          ncsId: s.tienTrinh.ncsId,
          newValue: {
            formId: created.id,
            tenNguoiCham: dto.tenNguoiCham,
            diem: dto.diem,
            isDraft,
          },
        },
      });

      return created;
    });

    return this.formatForm(form, sessionId);
  }

  /**
   * [S5-03, S5-04] Chỉnh sửa phiếu nhận xét (chỉ cho phép sửa phiếu nháp; khóa sửa nếu đã nộp).
   */
  async updateForm(actorId: string, sessionId: string, formId: string, dto: UpdateEvaluationFormDto) {
    const form = await this.prisma.phieuNhanXet.findUnique({
      where: { id: formId },
      include: { minhChung: { include: { tienTrinh: true } } },
    });

    if (!form || form.minhChungId !== sessionId) {
      throw new PhdEvaluationFormNotFoundException(formId);
    }

    const currentMeta = deserializeFormContent(form.nhanXet);
    if (!currentMeta.isDraft) {
      // Đã submit -> khóa không cho sửa
      throw new PhdEvaluationFormAlreadySubmittedException();
    }

    // Nếu có cập nhật điểm thì kiểm tra validate [S5-04]
    if (dto.diem !== undefined && !validateEvaluationScore(dto.diem)) {
      throw new PhdEvaluationScoreInvalidException();
    }

    const willBeDraft = dto.isDraft !== undefined ? dto.isDraft : currentMeta.isDraft;
    const serializedNhanXet = serializeFormContent({
      isDraft: willBeDraft,
      comment: dto.nhanXet !== undefined ? dto.nhanXet : currentMeta.comment,
      strengths: dto.strengths !== undefined ? dto.strengths : currentMeta.strengths,
      weaknesses: dto.weaknesses !== undefined ? dto.weaknesses : currentMeta.weaknesses,
    });

    const updated = await this.prisma.$transaction(async (tx) => {
      const res = await tx.phieuNhanXet.update({
        where: { id: formId },
        data: {
          tenNguoiCham: dto.tenNguoiCham || form.tenNguoiCham,
          donViNguoiCham: dto.donViNguoiCham !== undefined ? dto.donViNguoiCham : form.donViNguoiCham,
          diem: dto.diem !== undefined ? dto.diem : form.diem,
          nhanXet: serializedNhanXet,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId,
          action: willBeDraft ? 'EVALUATION_FORM_UPDATE' : 'EVALUATION_FORM_SUBMIT',
          entityType: 'PhieuNhanXet',
          entityId: formId,
          ncsId: form.minhChung.tienTrinh.ncsId,
          oldValue: {
            diem: Number(form.diem),
            isDraft: currentMeta.isDraft,
          },
          newValue: {
            diem: dto.diem !== undefined ? dto.diem : Number(form.diem),
            isDraft: willBeDraft,
          },
        },
      });

      return res;
    });

    return this.formatForm(updated, sessionId);
  }

  /**
   * [S5-03] Nộp chính thức phiếu nhận xét (chuyển từ nháp sang submit).
   */
  async submitForm(actorId: string, sessionId: string, formId: string) {
    const form = await this.prisma.phieuNhanXet.findUnique({
      where: { id: formId },
      include: { minhChung: { include: { tienTrinh: true } } },
    });

    if (!form || form.minhChungId !== sessionId) {
      throw new PhdEvaluationFormNotFoundException(formId);
    }

    const currentMeta = deserializeFormContent(form.nhanXet);
    if (!currentMeta.isDraft) {
      // Đã nộp rồi thì trả về luôn
      return this.formatForm(form, sessionId);
    }

    const serializedNhanXet = serializeFormContent({
      isDraft: false,
      comment: currentMeta.comment,
      strengths: currentMeta.strengths,
      weaknesses: currentMeta.weaknesses,
    });

    const updated = await this.prisma.$transaction(async (tx) => {
      const res = await tx.phieuNhanXet.update({
        where: { id: formId },
        data: { nhanXet: serializedNhanXet },
      });

      await tx.auditLog.create({
        data: {
          actorId,
          action: 'EVALUATION_FORM_SUBMIT',
          entityType: 'PhieuNhanXet',
          entityId: formId,
          ncsId: form.minhChung.tienTrinh.ncsId,
          newValue: {
            diem: Number(form.diem),
            status: 'SUBMITTED',
          },
        },
      });

      return res;
    });

    return this.formatForm(updated, sessionId);
  }

  /**
   * [S5-03] Xóa phiếu nhận xét nháp. Ràng buộc: KHÔNG hard-delete phiếu đã submit.
   */
  async deleteForm(actorId: string, sessionId: string, formId: string) {
    const form = await this.prisma.phieuNhanXet.findUnique({
      where: { id: formId },
      include: { minhChung: { include: { tienTrinh: true } } },
    });

    if (!form || form.minhChungId !== sessionId) {
      throw new PhdEvaluationFormNotFoundException(formId);
    }

    const currentMeta = deserializeFormContent(form.nhanXet);
    if (!currentMeta.isDraft) {
      // Ràng buộc bắt buộc: Không hard-delete phiếu đã submit
      throw new PhdEvaluationCannotDeleteSubmittedException();
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.phieuNhanXet.delete({
        where: { id: formId },
      });

      await tx.auditLog.create({
        data: {
          actorId,
          action: 'EVALUATION_FORM_DELETE',
          entityType: 'PhieuNhanXet',
          entityId: formId,
          ncsId: form.minhChung.tienTrinh.ncsId,
          oldValue: {
            tenNguoiCham: form.tenNguoiCham,
            diem: Number(form.diem),
            wasDraft: true,
          },
        },
      });
    });

    return {
      success: true,
      message: 'Đã xóa phiếu nhận xét nháp thành công',
    };
  }

  /**
   * [S5-05] Tính điểm trung bình & kiểm tra độ lệch điểm của đợt chấm.
   */
  async getSummary(sessionId: string) {
    const s = await this.prisma.minhChungMoc.findUnique({
      where: { id: sessionId },
      include: {
        quyetDinh: true,
        phieuNhanXets: true,
      },
    });

    if (!s) {
      throw new PhdEvaluationSessionNotFoundException(sessionId);
    }

    const assignedEvaluators = this.parseEvaluators(s.quyetDinh?.ghiChu);
    const forms = s.phieuNhanXets.map((f) => this.formatForm(f, s.id));
    return calculateEvaluationSummary(forms, assignedEvaluators.length);
  }

  /**
   * [S5-05, S5-06] Phê duyệt kết quả đợt chấm điểm và tự động cập nhật mốc tiến trình.
   */
  async approveSession(actorId: string, sessionId: string, dto: ApproveEvaluationDto) {
    const s = await this.prisma.minhChungMoc.findUnique({
      where: { id: sessionId },
      include: {
        tienTrinh: {
          include: {
            moc: true,
          },
        },
        quyetDinh: true,
        phieuNhanXets: true,
      },
    });

    if (!s) {
      throw new PhdEvaluationSessionNotFoundException(sessionId);
    }

    if (s.trangThai === TrangThaiMinhChung.PASSED) {
      throw new RpcException({
        statusCode: 400,
        message: 'Đợt chấm này đã được phê duyệt PASSED trước đó.',
      });
    }

    const assignedEvaluators = this.parseEvaluators(s.quyetDinh?.ghiChu);
    const forms = s.phieuNhanXets.map((f) => this.formatForm(f, s.id));
    const summary = calculateEvaluationSummary(forms, assignedEvaluators.length);

    if (summary.submittedCount === 0) {
      throw new PhdEvaluationNotEnoughFormsException('Chưa có phiếu nhận xét nào được nộp chính thức');
    }

    // [S5-05] Nếu chênh lệch > 3.0 điểm: Phát cảnh báo và khóa không cho Approve (PHD_SCORE_DIFFERENCE_EXCEEDED)
    if (summary.isDifferenceExceeded) {
      throw new PhdScoreDifferenceExceededException(summary.scoreDifference!);
    }

    if (!summary.canApprove) {
      throw new RpcException({
        statusCode: 400,
        errorCode: 'PHD_CANNOT_APPROVE',
        message: summary.warning || 'Không đủ điều kiện để phê duyệt đợt chấm',
      });
    }

    const averageScore = summary.averageScore!;
    const isPassed = summary.isPassed!; // [S5-06]: Điểm TB >= 7.0 thì PASSED, ngược lại REJECTED
    const now = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Cập nhật MinhChungMoc
      const updatedMinhChung = await tx.minhChungMoc.update({
        where: { id: sessionId },
        data: {
          trangThai: isPassed ? TrangThaiMinhChung.PASSED : TrangThaiMinhChung.REJECTED,
          diemTrungBinh: averageScore,
          lyDoTuChoi: isPassed ? null : 'Điểm trung bình không đạt yêu cầu (< 7.0)',
          nguoiDuyetId: actorId,
          ngayDuyet: now,
        },
      });

      // 2. Cập nhật mốc tiến trình hiện tại (TienTrinhNcs)
      await tx.tienTrinhNcs.update({
        where: { id: s.tienTrinh.id },
        data: {
          trangThai: isPassed ? TrangThaiMoc.PASSED : TrangThaiMoc.REJECTED,
          passedAt: isPassed ? now : null,
          version: { increment: 1 },
        },
      });

      // 3. [S5-06] Nếu PASSED, tự động mở khóa mốc tiếp theo (mốc N+1 chuyển từ LOCKED sang UNLOCKED)
      let nextMilestoneUnlocked: any = null;
      if (isPassed) {
        const currentThuTu = s.tienTrinh.moc.thuTu;
        const nextMoc = await tx.mocTienTrinh.findUnique({
          where: { thuTu: currentThuTu + 1 },
        });

        if (nextMoc) {
          const nextTienTrinh = await tx.tienTrinhNcs.findUnique({
            where: {
              ncsId_mocId: {
                ncsId: s.tienTrinh.ncsId,
                mocId: nextMoc.id,
              },
            },
          });

          if (nextTienTrinh && nextTienTrinh.trangThai === TrangThaiMoc.LOCKED) {
            const unlocked = await tx.tienTrinhNcs.update({
              where: { id: nextTienTrinh.id },
              data: {
                trangThai: TrangThaiMoc.UNLOCKED,
                openedAt: now,
                version: { increment: 1 },
              },
            });

            await tx.auditLog.create({
              data: {
                actorId,
                action: 'MILESTONE_AUTO_UNLOCK',
                entityType: 'TienTrinhNcs',
                entityId: unlocked.id,
                ncsId: s.tienTrinh.ncsId,
                newValue: {
                  mocId: nextMoc.id,
                  thuTu: nextMoc.thuTu,
                  tenMoc: nextMoc.tenMoc,
                  trangThai: TrangThaiMoc.UNLOCKED,
                  openedAt: now,
                },
              },
            });

            nextMilestoneUnlocked = {
              mocId: nextMoc.id,
              thuTu: nextMoc.thuTu,
              tenMoc: nextMoc.tenMoc,
            };
          }
        }
      }

      // 4. Ghi Audit Log cho kết quả phê duyệt
      await tx.auditLog.create({
        data: {
          actorId,
          action: isPassed ? 'EVALUATION_APPROVE_PASSED' : 'EVALUATION_APPROVE_REJECTED',
          entityType: 'MinhChungMoc',
          entityId: sessionId,
          ncsId: s.tienTrinh.ncsId,
          newValue: {
            averageScore,
            isPassed,
            scoreDifference: summary.scoreDifference,
            soQuyetDinh: dto.soQuyetDinh,
            ghiChu: dto.ghiChu,
          },
        },
      });

      return {
        minhChung: updatedMinhChung,
        nextMilestoneUnlocked,
      };
    });

    return {
      sessionId,
      isPassed,
      status: isPassed ? TrangThaiMinhChung.PASSED : TrangThaiMinhChung.REJECTED,
      averageScore,
      summary,
      nextMilestoneUnlocked: result.nextMilestoneUnlocked,
      message: isPassed
        ? `Phê duyệt đợt chấm PASSED thành công (Điểm TB: ${averageScore}). Đã mở khóa mốc tiếp theo!`
        : `Kết quả đánh giá REJECTED (Điểm TB: ${averageScore} < 7.0). Yêu cầu NCS hoàn thiện nộp lại.`,
    };
  }
}

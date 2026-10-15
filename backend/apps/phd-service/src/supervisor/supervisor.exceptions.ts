import { RpcException } from '@nestjs/microservices';
import { SUPERVISOR_ERROR_CODES, THESIS_ERROR_CODES } from '../../../../lib/contracts/src/permissions.js';

// ─── SUPERVISOR EXCEPTIONS ────────────────────────────────────────────────────

export class PhdSupervisorNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      statusCode: 404,
      errorCode: SUPERVISOR_ERROR_CODES.NOT_FOUND,
      message: `Không tìm thấy giảng viên hướng dẫn với ID: ${id}`,
    });
  }
}

/**
 * BR-09: Vượt định mức NCS đang hướng dẫn.
 * GS <= 7.0 | PGS <= 5.0 | TS <= 3.0
 */
export class PhdSupervisorQuotaExceededException extends RpcException {
  constructor(gvhdName: string, currentLoad: number, maxAllowed: number) {
    super({
      statusCode: 400,
      errorCode: SUPERVISOR_ERROR_CODES.QUOTA_EXCEEDED,
      message: `Giảng viên "${gvhdName}" đã vượt định mức hướng dẫn. Tải hiện tại: ${currentLoad} / Tối đa: ${maxAllowed} NCS. Không thể phân công thêm.`,
    });
  }
}

export class PhdSupervisorAssignmentNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      statusCode: 404,
      errorCode: SUPERVISOR_ERROR_CODES.ASSIGNMENT_NOT_FOUND,
      message: `Không tìm thấy phân công hướng dẫn với ID: ${id}`,
    });
  }
}

export class PhdSupervisorStudentNotFoundException extends RpcException {
  constructor(ncsId: string) {
    super({
      statusCode: 404,
      errorCode: SUPERVISOR_ERROR_CODES.STUDENT_NOT_FOUND,
      message: `Không tìm thấy nghiên cứu sinh với ID: ${ncsId}`,
    });
  }
}

export class PhdSupervisorDecisionRequiredException extends RpcException {
  constructor() {
    super({
      statusCode: 400,
      errorCode: SUPERVISOR_ERROR_CODES.DECISION_REQUIRED,
      message: 'Số quyết định và ngày ký là bắt buộc khi phân công GVHD.',
    });
  }
}

export class PhdSupervisorActiveAssignmentExistsException extends RpcException {
  constructor(ncsId: string) {
    super({
      statusCode: 400,
      errorCode: SUPERVISOR_ERROR_CODES.ACTIVE_ASSIGNMENT_EXISTS,
      message: `NCS "${ncsId}" đã có phân công GVHD đang hiệu lực. Hãy vô hiệu hóa phân công cũ trước khi tạo mới.`,
    });
  }
}

// ─── THESIS EXCEPTIONS ────────────────────────────────────────────────────────

export class PhdThesisNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      statusCode: 404,
      errorCode: THESIS_ERROR_CODES.NOT_FOUND,
      message: `Không tìm thấy đề tài với ID: ${id}`,
    });
  }
}

export class PhdThesisStudentNotFoundException extends RpcException {
  constructor(ncsId: string) {
    super({
      statusCode: 404,
      errorCode: THESIS_ERROR_CODES.STUDENT_NOT_FOUND,
      message: `Không tìm thấy nghiên cứu sinh với ID: ${ncsId}`,
    });
  }
}

export class PhdThesisActiveExistsException extends RpcException {
  constructor(ncsId: string) {
    super({
      statusCode: 400,
      errorCode: THESIS_ERROR_CODES.ACTIVE_THESIS_EXISTS,
      message: `NCS "${ncsId}" đã có đề tài đang hiệu lực. Dùng API "Cập nhật đề tài" để thay thế.`,
    });
  }
}

export class PhdThesisDecisionRequiredException extends RpcException {
  constructor() {
    super({
      statusCode: 400,
      errorCode: THESIS_ERROR_CODES.DECISION_REQUIRED,
      message: 'Số quyết định và ngày ký là bắt buộc khi giao/cập nhật đề tài.',
    });
  }
}

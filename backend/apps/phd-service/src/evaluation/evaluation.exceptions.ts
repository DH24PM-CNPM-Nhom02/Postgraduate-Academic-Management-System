import { RpcException } from '@nestjs/microservices';
import { EVALUATION_ERROR_CODES } from '../../../../lib/contracts/src/permissions.js';

export class PhdEvaluationScoreInvalidException extends RpcException {
  constructor(message = 'Điểm số không hợp lệ. Điểm phải trong thang 0.0 - 10.0 và có tối đa 1 chữ số thập phân.') {
    super({
      statusCode: 400,
      errorCode: EVALUATION_ERROR_CODES.SCORE_INVALID,
      message,
    });
  }
}

export class PhdScoreDifferenceExceededException extends RpcException {
  constructor(difference: number) {
    super({
      statusCode: 400,
      errorCode: EVALUATION_ERROR_CODES.SCORE_DIFFERENCE_EXCEEDED,
      message: `Chênh lệch điểm giữa các người chấm (${difference} điểm) vượt quá 3.0 điểm. Khóa không cho duyệt! Cần họp thống nhất lại điểm.`,
    });
  }
}

export class PhdEvaluationSessionNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      statusCode: 404,
      errorCode: EVALUATION_ERROR_CODES.SESSION_NOT_FOUND,
      message: `Không tìm thấy đợt chấm điểm với ID: ${id}`,
    });
  }
}

export class PhdEvaluationFormNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      statusCode: 404,
      errorCode: EVALUATION_ERROR_CODES.FORM_NOT_FOUND,
      message: `Không tìm thấy phiếu nhận xét với ID: ${id}`,
    });
  }
}

export class PhdEvaluationFormAlreadySubmittedException extends RpcException {
  constructor() {
    super({
      statusCode: 400,
      errorCode: EVALUATION_ERROR_CODES.FORM_ALREADY_SUBMITTED,
      message: 'Phiếu nhận xét đã nộp chính thức, không thể chỉnh sửa.',
    });
  }
}

export class PhdEvaluationCannotDeleteSubmittedException extends RpcException {
  constructor() {
    super({
      statusCode: 400,
      errorCode: EVALUATION_ERROR_CODES.CANNOT_DELETE_SUBMITTED,
      message: 'Không thể xóa phiếu nhận xét đã nộp chính thức.',
    });
  }
}

export class PhdEvaluationNotEnoughFormsException extends RpcException {
  constructor(message = 'Chưa có đủ phiếu nhận xét hợp lệ để tiến hành phê duyệt.') {
    super({
      statusCode: 400,
      errorCode: EVALUATION_ERROR_CODES.NOT_ENOUGH_FORMS,
      message,
    });
  }
}

export class PhdMilestoneNotFoundException extends RpcException {
  constructor(mocId: number) {
    super({
      statusCode: 404,
      errorCode: EVALUATION_ERROR_CODES.MILESTONE_NOT_FOUND,
      message: `Không tìm thấy mốc tiến trình thứ ${mocId}`,
    });
  }
}

export class PhdStudentNotFoundException extends RpcException {
  constructor(ncsId: string) {
    super({
      statusCode: 404,
      errorCode: EVALUATION_ERROR_CODES.STUDENT_NOT_FOUND,
      message: `Không tìm thấy nghiên cứu sinh với ID: ${ncsId}`,
    });
  }
}

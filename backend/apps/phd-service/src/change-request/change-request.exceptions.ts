import { RpcException } from '@nestjs/microservices';
import { CHANGE_REQUEST_ERROR_CODES } from '../../../../lib/contracts/src/permissions.js';

export class PhdChangeRequestNotFoundException extends RpcException {
  constructor(id: string) {
    super({
      statusCode: 404,
      errorCode: CHANGE_REQUEST_ERROR_CODES.NOT_FOUND,
      message: `Không tìm thấy đơn đề nghị thay đổi với ID: ${id}`,
    });
  }
}

export class PhdChangeRequestAlreadyProcessedException extends RpcException {
  constructor(id: string, currentStatus: string) {
    super({
      statusCode: 400,
      errorCode: CHANGE_REQUEST_ERROR_CODES.ALREADY_PROCESSED,
      message: `Đơn đề nghị ${id} đã được xử lý (trạng thái hiện tại: ${currentStatus}). Không thể xử lý lại.`,
    });
  }
}

export class PhdChangeRequestRejectReasonRequiredException extends RpcException {
  constructor() {
    super({
      statusCode: 400,
      errorCode: CHANGE_REQUEST_ERROR_CODES.REJECT_REASON_REQUIRED,
      message: 'Bắt buộc phải nhập lý do khi từ chối đơn đề nghị.',
    });
  }
}

export class PhdChangeRequestInvalidDataException extends RpcException {
  constructor(reason: string) {
    super({
      statusCode: 400,
      errorCode: CHANGE_REQUEST_ERROR_CODES.INVALID_DATA,
      message: `Dữ liệu đơn đề nghị không hợp lệ: ${reason}`,
    });
  }
}

export class PhdChangeRequestStudentNotFoundException extends RpcException {
  constructor(ncsId: string) {
    super({
      statusCode: 404,
      errorCode: CHANGE_REQUEST_ERROR_CODES.STUDENT_NOT_FOUND,
      message: `Không tìm thấy Nghiên cứu sinh với ID: ${ncsId}`,
    });
  }
}

export class PhdChangeRequestAssignmentNotFoundException extends RpcException {
  constructor(assignmentId: string) {
    super({
      statusCode: 404,
      errorCode: CHANGE_REQUEST_ERROR_CODES.ASSIGNMENT_NOT_FOUND,
      message: `Không tìm thấy bản ghi phân công GVHD cũ với ID: ${assignmentId}`,
    });
  }
}

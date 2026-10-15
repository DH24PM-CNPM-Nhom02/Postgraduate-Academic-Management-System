import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type {
  ApproveChangeRequestDto,
  CreateChangeRequestDto,
  QueryChangeRequestsDto,
  RejectChangeRequestDto,
} from '../../../../lib/contracts/src/dto/change-request.dto.js';
import { ChangeRequestService } from './change-request.service.js';

@Controller()
export class ChangeRequestController {
  constructor(private readonly changeRequestService: ChangeRequestService) {}

  @MessagePattern({ cmd: 'phd.change-request.submit' })
  submitChangeRequest(
    @Payload() data: { actorId: string; dto: CreateChangeRequestDto },
  ) {
    return this.changeRequestService.submitChangeRequest(data.actorId, data.dto);
  }

  @MessagePattern({ cmd: 'phd.change-request.approve' })
  approveChangeRequest(
    @Payload()
    data: {
      actorId: string;
      id: string;
      dto: ApproveChangeRequestDto;
      correlationId?: string;
    },
  ) {
    return this.changeRequestService.approveChangeRequest(
      data.actorId,
      data.id,
      data.dto,
      data.correlationId,
    );
  }

  @MessagePattern({ cmd: 'phd.change-request.reject' })
  rejectChangeRequest(
    @Payload()
    data: {
      actorId: string;
      id: string;
      dto: RejectChangeRequestDto;
    },
  ) {
    return this.changeRequestService.rejectChangeRequest(data.actorId, data.id, data.dto);
  }

  @MessagePattern({ cmd: 'phd.change-request.list' })
  listChangeRequests(@Payload() query: QueryChangeRequestsDto) {
    return this.changeRequestService.listChangeRequests(query);
  }

  @MessagePattern({ cmd: 'phd.change-request.get' })
  getChangeRequest(@Payload() data: { id: string }) {
    return this.changeRequestService.getChangeRequest(data.id);
  }
}

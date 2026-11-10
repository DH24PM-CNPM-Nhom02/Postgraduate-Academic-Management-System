import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeRequestService } from './change-request.service.js';
import {
  ApproveDeNghiDto,
  CreateChangeRequestDto,
  ListDeNghiQuery,
  SupervisorReviewDeNghiDto,
} from '../../../../lib/contracts/src/dto/change-request.dto.js';

@Controller()
export class ChangeRequestController {
  constructor(private readonly changeRequest: ChangeRequestService) { }

  @MessagePattern({ cmd: 'phd.change-request.create' })
  create(@Payload() d: CreateChangeRequestDto & { userId: string }) {
    const { userId, ...dto } = d;
    return this.changeRequest.create(userId, dto);
  }

  @MessagePattern({ cmd: "phd.change-request.cancel" })
  huy(@Payload() d: { id: string, userId: string }) {
    return this.changeRequest.huyDeNghi(d.userId, d.id);
  }

  @MessagePattern({ cmd: "phd.change-request.list" })
  list(@Payload() d: (ListDeNghiQuery & { userId: string }) | { userId: string; q?: ListDeNghiQuery }) {
    const userId = d.userId;
    const query = ('q' in d && d.q) ? d.q : (() => { const { userId: _, ...rest } = d as any; return rest; })();
    return this.changeRequest.list(userId, query as ListDeNghiQuery);
  }

  @MessagePattern({ cmd: "phd.change-request.detail" })
  detail(@Payload() d: { userId: string, id: string }) {
    return this.changeRequest.detail(d.userId, d.id);
  }

  @MessagePattern({ cmd: "phd.change-request.supervisor-review" })
  supervisorReview(@Payload() d: { userId: string; id: string; review: SupervisorReviewDeNghiDto }) {
    return this.changeRequest.xacNhanGvhd(d.userId, d.id, d.review);
  }

  @MessagePattern({ cmd: "phd.change-request.reject" })
  reject(@Payload() d: { userId: string, id: string, lyDoTuChoi: string }) {
    const { userId, ...rest } = d;
    return this.changeRequest.tuChoi(userId, rest.id, rest.lyDoTuChoi);
  }

  @MessagePattern({ cmd: 'phd.change-request.approve' })
  approve(@Payload() d: { userId: string; id: string } & ApproveDeNghiDto) {
    const { userId, id, ...dto } = d;
    return this.changeRequest.duyet(userId, id, dto);
  }
}
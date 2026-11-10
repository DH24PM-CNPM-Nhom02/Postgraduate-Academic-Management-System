import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { AssignThesisDto, DeactivateThesisAssignmentDto, ThesisListQueryDto } from '../../../../lib/contracts/src/dto/thesis.dto.js';
import { ThesisService } from './thesis.service.js';

@Controller()
export class ThesisController {
  constructor(private readonly thesis: ThesisService) { }

  @MessagePattern({ cmd: 'phd.thesis.assign' })
  assign(@Payload() data: { actorId: string; data: AssignThesisDto }) {
    return this.thesis.assign(data.actorId, data.data);
  }

  @MessagePattern({ cmd: 'phd.thesis.deactivate' })
  deactivate(@Payload() data: { actorId: string; id: string; data: DeactivateThesisAssignmentDto }) {
    console.log(data.data.lyDo)
    return this.thesis.deactivate(data.actorId, data.id, data.data);
  }

  @MessagePattern({ cmd: 'phd.thesis.list' })
  list(@Payload() data: { query: ThesisListQueryDto }) {
    return this.thesis.list(data.query ?? {});
  }

  @MessagePattern({ cmd: 'phd.thesis.detail' })
  detail(@Payload() data: { ncsId: string }) {
    return this.thesis.detail(data.ncsId);
  }

  @MessagePattern({ cmd: 'phd.thesis.ncs-me' })
  myThesisAsNcs(@Payload() data: { userId: string }) {
    return this.thesis.getMyThesisAndSupervisors(data.userId);
  }

}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type {
  ApproveEvaluationDto,
  AssignEvaluatorsDto,
  CreateEvaluationFormDto,
  CreateEvaluationSessionDto,
  QueryEvaluationSessionsDto,
  UpdateEvaluationFormDto,
} from '../../../../lib/contracts/src/dto/evaluation.dto.js';
import { EvaluationService } from './evaluation.service.js';

@Controller()
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @MessagePattern({ cmd: 'phd.evaluation.list' })
  listSessions(@Payload() query: QueryEvaluationSessionsDto) {
    return this.evaluationService.listSessions(query);
  }

  @MessagePattern({ cmd: 'phd.evaluation.get' })
  getSession(@Payload() d: { id: string }) {
    return this.evaluationService.getSession(d.id);
  }

  @MessagePattern({ cmd: 'phd.evaluation.create-session' })
  createSession(@Payload() d: { actorId: string; dto: CreateEvaluationSessionDto }) {
    return this.evaluationService.createSession(d.actorId, d.dto);
  }

  @MessagePattern({ cmd: 'phd.evaluation.assign' })
  assignEvaluators(@Payload() d: { actorId: string; sessionId: string; dto: AssignEvaluatorsDto }) {
    return this.evaluationService.assignEvaluators(d.actorId, d.sessionId, d.dto);
  }

  @MessagePattern({ cmd: 'phd.evaluation.create-form' })
  createForm(@Payload() d: { actorId: string; sessionId: string; dto: CreateEvaluationFormDto }) {
    return this.evaluationService.createForm(d.actorId, d.sessionId, d.dto);
  }

  @MessagePattern({ cmd: 'phd.evaluation.update-form' })
  updateForm(
    @Payload() d: { actorId: string; sessionId: string; formId: string; dto: UpdateEvaluationFormDto },
  ) {
    return this.evaluationService.updateForm(d.actorId, d.sessionId, d.formId, d.dto);
  }

  @MessagePattern({ cmd: 'phd.evaluation.submit-form' })
  submitForm(@Payload() d: { actorId: string; sessionId: string; formId: string }) {
    return this.evaluationService.submitForm(d.actorId, d.sessionId, d.formId);
  }

  @MessagePattern({ cmd: 'phd.evaluation.delete-form' })
  deleteForm(@Payload() d: { actorId: string; sessionId: string; formId: string }) {
    return this.evaluationService.deleteForm(d.actorId, d.sessionId, d.formId);
  }

  @MessagePattern({ cmd: 'phd.evaluation.summary' })
  getSummary(@Payload() d: { sessionId: string }) {
    return this.evaluationService.getSummary(d.sessionId);
  }

  @MessagePattern({ cmd: 'phd.evaluation.approve' })
  approveSession(@Payload() d: { actorId: string; sessionId: string; dto: ApproveEvaluationDto }) {
    return this.evaluationService.approveSession(d.actorId, d.sessionId, d.dto);
  }
}

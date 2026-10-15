import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type {
  AssignSupervisorDto,
  ChangeSupervisorDto,
  CreateSupervisorDto,
  QueryAssignmentsDto,
  QuerySupervisorsDto,
  UpdateSupervisorDto,
} from '../../../../lib/contracts/src/dto/supervisor.dto.js';
import type {
  CreateThesisDto,
  QueryThesisDto,
  UpdateThesisDto,
} from '../../../../lib/contracts/src/dto/thesis.dto.js';
import { SupervisorService } from './supervisor.service.js';
import { ThesisService } from './thesis.service.js';

@Controller()
export class SupervisorController {
  constructor(
    private readonly supervisorService: SupervisorService,
    private readonly thesisService: ThesisService,
  ) {}

  // ─── GVHD CRUD ────────────────────────────────────────────────────────────

  @MessagePattern({ cmd: 'phd.supervisor.list' })
  listSupervisors(@Payload() query: QuerySupervisorsDto) {
    return this.supervisorService.listSupervisors(query);
  }

  @MessagePattern({ cmd: 'phd.supervisor.get' })
  getSupervisor(@Payload() d: { id: string }) {
    return this.supervisorService.getSupervisor(d.id);
  }

  @MessagePattern({ cmd: 'phd.supervisor.create' })
  createSupervisor(@Payload() d: { actorId: string; dto: CreateSupervisorDto }) {
    return this.supervisorService.createSupervisor(d.actorId, d.dto);
  }

  @MessagePattern({ cmd: 'phd.supervisor.update' })
  updateSupervisor(@Payload() d: { actorId: string; id: string; dto: UpdateSupervisorDto }) {
    return this.supervisorService.updateSupervisor(d.actorId, d.id, d.dto);
  }

  // ─── Quota ────────────────────────────────────────────────────────────────

  @MessagePattern({ cmd: 'phd.supervisor.quota' })
  getQuotaStatus(@Payload() d: { gvhdId: string }) {
    return this.supervisorService.getQuotaStatus(d.gvhdId);
  }

  // ─── Phân công GVHD (Transaction + Pessimistic Lock) ─────────────────────

  @MessagePattern({ cmd: 'phd.supervisor.assign' })
  assignSupervisor(@Payload() d: { actorId: string; dto: AssignSupervisorDto }) {
    return this.supervisorService.assignSupervisor(d.actorId, d.dto);
  }

  @MessagePattern({ cmd: 'phd.supervisor.change' })
  changeSupervisor(@Payload() d: { actorId: string; dto: ChangeSupervisorDto }) {
    return this.supervisorService.changeSupervisor(d.actorId, d.dto);
  }

  @MessagePattern({ cmd: 'phd.supervisor.assignments' })
  listAssignments(@Payload() query: QueryAssignmentsDto) {
    return this.supervisorService.listAssignments(query);
  }

  // ─── ĐỀ TÀI ─────────────────────────────────────────────────────────────

  @MessagePattern({ cmd: 'phd.thesis.list' })
  listTheses(@Payload() query: QueryThesisDto) {
    return this.thesisService.listTheses(query);
  }

  @MessagePattern({ cmd: 'phd.thesis.get' })
  getThesis(@Payload() d: { id: string }) {
    return this.thesisService.getThesis(d.id);
  }

  @MessagePattern({ cmd: 'phd.thesis.current' })
  getCurrentThesisByNcs(@Payload() d: { ncsId: string }) {
    return this.thesisService.getCurrentThesisByNcs(d.ncsId);
  }

  @MessagePattern({ cmd: 'phd.thesis.create' })
  createThesis(@Payload() d: { actorId: string; dto: CreateThesisDto }) {
    return this.thesisService.createThesis(d.actorId, d.dto);
  }

  @MessagePattern({ cmd: 'phd.thesis.update' })
  updateThesis(@Payload() d: { actorId: string; id: string; dto: UpdateThesisDto }) {
    return this.thesisService.updateThesis(d.actorId, d.id, d.dto);
  }

  @MessagePattern({ cmd: 'phd.thesis.history' })
  getThesisHistory(@Payload() d: { ncsId: string }) {
    return this.thesisService.getThesisHistory(d.ncsId);
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { ImportGvhdRow, UpdateGvhdDto, UpdateGvhdStatusDto } from '../../../../lib/contracts/src/dto/gvhd.dto.js';
import type { CreateAssignmentDto, ListAssignmentQueryDto } from '../../../../lib/contracts/src/dto/assignment.dto.js';
import { SupervisorService } from './supervisor.service.js';
// import { GvhdImportService } from './gvhd-import.service.js';


@Controller()
export class SupervisorController {
  constructor(private readonly gvhd: SupervisorService) { }

  // @MessagePattern({ cmd: 'phd.gvhd.create-many' })
  // createMany(@Payload() d: { actorId: string; items: CreateGvhdItemDto[] }) {
  //   return this.gvhd.createMany(d.actorId, d.items);
  // }

  @MessagePattern({ cmd: 'phd.gvhd.import-preview' })
  preview(@Payload() d: { rows: ImportGvhdRow[] }) {
    return this.gvhd.importMany('', d.rows, false);
  }

  @MessagePattern({ cmd: 'phd.gvhd.import-confirm' })
  confirm(@Payload() d: { actorId: string; rows: ImportGvhdRow[] }) {
    return this.gvhd.importMany(d.actorId, d.rows, true);
  }

  @MessagePattern({ cmd: 'phd.gvhd.list' })
  list() {
    return this.gvhd.getAllSupervisor();
  }

  @MessagePattern({ cmd: 'phd.gvhd.get' })
  getDetailGvhd(@Payload() d: { id?: string; userId?: string }) {
    return this.gvhd.getDetailSupervisor(d);
  }

  @MessagePattern({ cmd: 'phd.gvhd.my-ncs' })
  getMyNcsList(@Payload() d: { userId: string }) {
    return this.gvhd.getMyNcsList(d.userId);
  }

  @MessagePattern({ cmd: 'phd.gvhd.my-ncs-detail' })
  getMyNcsDetail(@Payload() d: { userId: string; ncsId: string }) {
    return this.gvhd.getMyNcsDetail(d.userId, d.ncsId);
  }

  @MessagePattern({ cmd: 'phd.gvhd.assignment-create' })
  createAssignment(@Payload() d: { actorId: string; data: CreateAssignmentDto }) {
    return this.gvhd.createAssignment(d.actorId, d.data);
  }

  @MessagePattern({ cmd: 'phd.gvhd.assignment-deactivate' })
  deactivateAssignment(@Payload() d: { actorId: string; id: string }) {
    return this.gvhd.deactivateAssignment(d.actorId, d.id);
  }

  @MessagePattern({ cmd: 'phd.gvhd.assignment-list' })
  listAssignments(@Payload() d: { query?: ListAssignmentQueryDto }) {
    return this.gvhd.listAssignments(d.query || {});
  }

  @MessagePattern({ cmd: 'phd.gvhd.update' })
  update(@Payload() d: { actorId: string; id: string; data: UpdateGvhdDto }) {
    return this.gvhd.updateSupervisor(d.actorId, d.id, d.data);
  }

  @MessagePattern({ cmd: 'phd.gvhd.update-status' })
  updateStatus(@Payload() d: { actorId: string; id: string; data: UpdateGvhdStatusDto }) {
    return this.gvhd.updateStatus(d.actorId, d.id, d.data);
  }

  // @MessagePattern({ cmd: 'phd.gvhd.update-many' })
  // updateMany(@Payload() d: { actorId: string; items: UpdateGvhdItemDto[] }) {
  //   return this.gvhd.updateMany(d.actorId, d.items);
  // }
}
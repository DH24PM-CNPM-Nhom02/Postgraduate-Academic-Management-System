import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { ImportGvhdRow, UpdateGvhdDto, UpdateGvhdStatusDto } from '../../../../lib/contracts/src/dto/gvhd.dto.js';
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
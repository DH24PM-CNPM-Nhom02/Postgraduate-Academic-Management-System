import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { CreateGvhdItemDto, ImportGvhdRow } from '../../../../lib/contracts/src/dto/gvhd.dto.js';
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
}
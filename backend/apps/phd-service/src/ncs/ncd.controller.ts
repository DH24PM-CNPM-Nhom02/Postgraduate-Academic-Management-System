import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { CreateNcsItemDto, ImportNcsRow } from '../../../../lib/contracts/src/dto/ncs.dto.js';
import { NcsService } from './ncs.service.js';
import { NcsImportService } from './ncs-import.service.js';


@Controller()
export class NcsController {
  constructor(private readonly ncs: NcsService, private readonly ncsImport: NcsImportService) { }

  @MessagePattern({ cmd: 'phd.ncs.create-many' })
  createMany(@Payload() d: { actorId: string; items: CreateNcsItemDto[] }) {
    return this.ncs.createMany(d.actorId, d.items);
  }

  @MessagePattern({ cmd: 'phd.ncs.import-preview' })
  preview(@Payload() d: { rows: ImportNcsRow[] }) {
    return this.ncsImport.preview(d.rows);
  }

  @MessagePattern({ cmd: 'phd.ncs.import-confirm' })
  confirm(@Payload() d: { actorId: string; rows: ImportNcsRow[] }) {
    return this.ncsImport.confirm(d.actorId, d.rows);
  }

  @MessagePattern({ cmd: 'phd.ncs.list' })
  list() {
    return this.ncs.getAllNcs();
  }

  @MessagePattern({ cmd: 'phd.ncs.get' })
  getDetailNcs(@Payload() d: { id?: string; userId?: string }) {
    return this.ncs.getDetailNcs(d);
  }
}
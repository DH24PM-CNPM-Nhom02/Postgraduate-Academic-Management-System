import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { ListAuditQueryDto } from '../../../../lib/contracts/src/dto/audit.dto.js';
import { AuditService } from './audit.service.js';

@Controller()
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @MessagePattern({ cmd: 'phd.audit.list' })
  getListAudit(@Payload() query: ListAuditQueryDto) {
    return this.audit.getListAudit(query);
  }

  @MessagePattern({ cmd: 'phd.audit.get' })
  getAuditById(@Payload() d: { id: string }) {
    return this.audit.getAuditById(d.id);
  }
}

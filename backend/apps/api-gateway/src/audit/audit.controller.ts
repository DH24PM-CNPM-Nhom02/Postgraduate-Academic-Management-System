import { Controller, Get, Inject, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import { PERMISSIONS } from '../../../../lib/contracts/src/permissions.js';
import { ListAuditQueryDto } from '../../../../lib/contracts/src/dto/audit.dto.js';

@Controller(['audit-logs', 'audits'])
export class AuditController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) {}

  private send<T>(cmd: string, payload: unknown, ms = 10000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  @Get()
  @RequirePermissions(PERMISSIONS.AUDIT_READ)
  list(@Query() query: ListAuditQueryDto) {
    return this.send('phd.audit.list', query);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.AUDIT_READ)
  detail(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.send('phd.audit.get', { id });
  }
}

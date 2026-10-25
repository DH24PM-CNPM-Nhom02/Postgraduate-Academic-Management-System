import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import {
  CreateDecisionDto, DeactivateDecisionDto, ListDecisionQueryDto,
} from '../../../../lib/contracts/src/dto/decision.dto.js';
import { PERMISSIONS } from '../../../../lib/contracts/src/permissions.js';

@Controller('decisions')
export class DecisionController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) { }

  private send<T>(cmd: string, payload: unknown, ms = 10000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  @Post()
  @RequirePermissions(PERMISSIONS.DECISION_CREATE)
  create(@CurrentUser() u: AuthUser, @Body() body: CreateDecisionDto) {
    // Người tạo lấy từ token
    return this.send('phd.decision.create', { ...body, nguoiTaoId: u.id });
  }

  @Get()
  @RequirePermissions(PERMISSIONS.DECISION_READ)
  list(@Query() q: ListDecisionQueryDto) {
    return this.send('phd.decision.list', q);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.DECISION_READ)
  detail(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.send('phd.decision.get', { id });
  }

  @Patch(':id/deactivate')
  @RequirePermissions(PERMISSIONS.DECISION_UPDATE)
  deactivate(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: DeactivateDecisionDto,
  ) {
    return this.send('phd.decision.deactivate', { id, lyDo: body.lyDo });
  }
}
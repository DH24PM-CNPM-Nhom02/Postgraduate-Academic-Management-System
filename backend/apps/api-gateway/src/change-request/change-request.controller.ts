import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import {
  ApproveDeNghiDto,
  CreateChangeRequestDto,
  ListDeNghiQuery,
  RejectDeNghiDto,
  SupervisorReviewDeNghiDto,
} from '../../../../lib/contracts/src/dto/change-request.dto.js';
import { PERMISSIONS } from '../../../../lib/contracts/src/permissions.js';

@Controller('change-request')
export class ChangeRequestController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) { }

  private send<T>(cmd: string, payload: unknown, ms = 10000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  @Post()
  @RequirePermissions(PERMISSIONS.CHANGE_REQUEST_CREATE)
  create(@CurrentUser() u: AuthUser, @Body() body: CreateChangeRequestDto) {
    return this.send('phd.change-request.create', { ...body, userId: u.id });
  }

  @Get()
  @RequirePermissions(PERMISSIONS.CHANGE_REQUEST_READ)
  list(@CurrentUser() u: AuthUser, @Query() q: ListDeNghiQuery) {
    return this.send('phd.change-request.list', { userId: u.id, ...q });
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.CHANGE_REQUEST_READ)
  detail(@CurrentUser() u: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.send('phd.change-request.detail', { userId: u.id, id });
  }

  @Patch(':id/cancel')
  @RequirePermissions(PERMISSIONS.CHANGE_REQUEST_CANCEL)
  cancel(@CurrentUser() u: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.send('phd.change-request.cancel', { userId: u.id, id });
  }

  @Patch(':id/supervisor-review')
  @RequirePermissions(PERMISSIONS.CHANGE_REQUEST_SUPERVISOR_REVIEW)
  supervisorReview(
    @CurrentUser() u: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SupervisorReviewDeNghiDto,
  ) {
    return this.send('phd.change-request.supervisor-review', {
      userId: u.id,
      id,
      review: body,
    });
  }

  @Patch(':id/reject')
  @RequirePermissions(PERMISSIONS.CHANGE_REQUEST_REVIEW)
  reject(@CurrentUser() u: AuthUser, @Param('id', ParseUUIDPipe) id: string, @Body() body: RejectDeNghiDto) {
    return this.send('phd.change-request.reject', { userId: u.id, id, lyDoTuChoi: body.lyDoTuChoi });
  }

  @Patch(':id/approve')
  @RequirePermissions(PERMISSIONS.CHANGE_REQUEST_REVIEW)
  approve(
    @CurrentUser() u: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: ApproveDeNghiDto,
  ) {
    return this.send('phd.change-request.approve', { userId: u.id, id, ...body });
  }
}
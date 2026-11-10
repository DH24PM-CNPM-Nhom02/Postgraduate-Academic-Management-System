import { Body, Controller, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import { AssignThesisDto, DeactivateThesisAssignmentDto, ThesisListQueryDto } from '../../../../lib/contracts/src/dto/thesis.dto.js';
import { PERMISSIONS } from '../../../../lib/contracts/src/permissions.js';

@Controller('thesis')
export class ThesisController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) { }

  private send<T>(cmd: string, payload: unknown, ms = 5000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  @Post()
  @RequirePermissions(PERMISSIONS.ASSIGNMENT_CREATE)
  assign(@CurrentUser() user: AuthUser, @Body() dto: AssignThesisDto) {
    return this.send('phd.thesis.assign', { actorId: user.id, data: dto });
  }

  @Patch(':id/deactivate')
  @RequirePermissions(PERMISSIONS.ASSIGNMENT_UPDATE)
  cancel(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: DeactivateThesisAssignmentDto) {
    return this.send('phd.thesis.deactivate', { actorId: user.id, id, data: dto });
  }

  @Get()
  @RequirePermissions(PERMISSIONS.ASSIGNMENT_READ)
  list(@Query() query: ThesisListQueryDto) {
    return this.send('phd.thesis.list', { query });
  }

  @Get('ncs/me')
  @RequirePermissions(PERMISSIONS.THESIS_CHANGE_CREATE)
  myThesisAsNcs(@CurrentUser() user: AuthUser) {
    return this.send('phd.thesis.ncs-me', { userId: user.id });
  }

  @Get('admin/:ncsId')
  @RequirePermissions(PERMISSIONS.ASSIGNMENT_READ)
  detailForAdmin(@Param('ncsId') ncsId: string) {
    return this.send('phd.thesis.detail', { ncsId });
  }
}

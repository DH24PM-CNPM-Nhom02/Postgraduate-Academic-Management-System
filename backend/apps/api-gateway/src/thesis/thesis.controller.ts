import { Body, Controller, Get, HttpCode, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import { AssignThesisDto, DeactivateThesisAssignmentDto, ThesisListQueryDto } from '../../../../lib/contracts/src/dto/thesis.dto.js';
import { PERMISSIONS } from '../../../../lib/contracts/src/permissions.js';
import { LimitHeavyRead } from '../common/decorators/rate-limit.decorator.js';
import { downloadWorkbook, ExportExcelDto, selectExportRows } from '../common/list-excel.js';
import { buildThesisListWorkbook, type ThesisExportRecord } from './thesis-excel.js';

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

  @Post('export')
  @HttpCode(200)
  @LimitHeavyRead()
  @RequirePermissions(PERMISSIONS.ASSIGNMENT_READ)
  async exportExcel(@Body() body: ExportExcelDto) {
    const records = await this.send<ThesisExportRecord[]>('phd.thesis.list', { query: {} }, 20000);
    return downloadWorkbook(buildThesisListWorkbook(selectExportRows(records, body.ids)), 'danh-sach-de-tai.xlsx');
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

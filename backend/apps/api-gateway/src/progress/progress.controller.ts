import { BadRequestException, Body, Controller, Get, Inject, Param, ParseIntPipe, ParseUUIDPipe, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import { SubmitMilestoneDto } from '../../../../lib/contracts/src/dto/progress.dto.js';
import { PERMISSIONS } from '../../../../lib/contracts/src/permissions.js';

@Controller('progress')
export class ProgressController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) { }

  private send<T>(cmd: string, payload: unknown, ms = 10000) {
    return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
  }

  // NCS nộp minh chứng cho mốc số :thuTu (mốc 1 tự động đạt nên chỉ nhận 2 đến 9)
  @Post('milestones/:thuTu/submit')
  @RequirePermissions(PERMISSIONS.MILESTONE_SUBMIT)
  submit(
    @CurrentUser() u: AuthUser,
    @Param('thuTu', ParseIntPipe) thuTu: number,
    @Body() body: SubmitMilestoneDto,
  ) {
    if (thuTu < 2 || thuTu > 9) {
      throw new BadRequestException('Số thứ tự mốc phải từ 2 đến 9');
    }
    // userId lấy từ token, không lấy từ client
    return this.send('phd.progress.submit', {
      userId: u.id,
      thuTu,
      fileId: body.fileId,
      ghiChu: body.ghiChu,
    });
  }

  // NCS xem tiến trình của mình
  @Get('me')
  @RequirePermissions(PERMISSIONS.MILESTONE_READ)
  myProgress(@CurrentUser() u: AuthUser) {
    return this.send('phd.progress.my', { userId: u.id });
  }

  // Giáo vụ: danh sách mốc chờ duyệt
  @Get('pending')
  @RequirePermissions(PERMISSIONS.MILESTONE_APPROVE)
  pending() {
    return this.send('phd.progress.pending', {});
  }

  // Giáo vụ: tiến trình của một NCS
  @Get('ncs/:ncsId')
  @RequirePermissions(PERMISSIONS.MILESTONE_APPROVE)
  progressOfNcs(@Param('ncsId', new ParseUUIDPipe()) ncsId: string) {
    return this.send('phd.progress.ncs', { ncsId });
  }
}
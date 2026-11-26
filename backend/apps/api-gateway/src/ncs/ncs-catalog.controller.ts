import { Body, Controller, Delete, ExecutionContext, ForbiddenException, Get, Inject, Injectable, Param, ParseIntPipe, Patch, Post, UseGuards, type CanActivate } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PERMISSIONS, ROLES } from '../../../../lib/contracts/src/permissions.js';
import { CreateMajorDto, CreateCohortDto, UpdateMajorDto, UpdateCohortDto } from '../../../../lib/contracts/src/dto/ncs-catalog.dto.js';

@Injectable()
export class CatalogStaffGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const user: AuthUser | undefined = context.switchToHttp().getRequest().user;
    if (user?.roles.some(role => role === ROLES.ADMIN || role === ROLES.GIAO_VU)) return true;
    throw new ForbiddenException('Chỉ Admin và Giáo vụ được quản lý danh mục đào tạo.');
  }
}

@Controller('ncs/catalogs')
@RequirePermissions(PERMISSIONS.NCS_READ)
@UseGuards(CatalogStaffGuard)
export class NcsCatalogController {
  constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) {}

  private send(cmd: string, payload: unknown) {
    return firstValueFrom(this.phd.send({ cmd }, payload).pipe(timeout(5000)));
  }

  @Get('khoa-hoc')
  listCohorts() {
    return this.send('phd.ncs.catalog.cohorts', {});
  }

  @Get('khoa-hoc/:id')
  getCohort(@Param('id') id: string) {
    return this.send('phd.ncs.catalog.cohorts.get', { id });
  }

  @Post('khoa-hoc')
  createCohort(@Body() data: CreateCohortDto) {
    return this.send('phd.ncs.catalog.cohorts.create', { data });
  }

  @Patch('khoa-hoc/:id')
  updateCohort(@Param('id') id: string, @Body() data: UpdateCohortDto) {
    return this.send('phd.ncs.catalog.cohorts.update', { id, data });
  }

  @Delete('khoa-hoc/:id')
  deleteCohort(@Param('id') id: string) {
    return this.send('phd.ncs.catalog.cohorts.delete', { id });
  }

  @Get('nganh-dao-tao')
  listMajors() {
    return this.send('phd.ncs.catalog.majors', {});
  }

  @Get('nganh-dao-tao/:id')
  getMajor(@Param('id', ParseIntPipe) id: number) {
    return this.send('phd.ncs.catalog.majors.get', { id });
  }

  @Post('nganh-dao-tao')
  createMajor(@Body() data: CreateMajorDto) {
    return this.send('phd.ncs.catalog.majors.create', { data });
  }

  @Patch('nganh-dao-tao/:id')
  updateMajor(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMajorDto) {
    return this.send('phd.ncs.catalog.majors.update', { id, data });
  }

  @Delete('nganh-dao-tao/:id')
  deleteMajor(@Param('id', ParseIntPipe) id: number) {
    return this.send('phd.ncs.catalog.majors.delete', { id });
  }
}

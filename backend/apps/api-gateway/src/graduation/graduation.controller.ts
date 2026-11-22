import { Body, Controller, ForbiddenException, Get, Inject, Param, ParseUUIDPipe, Post, Put, Query, StreamableFile } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator.js';
import { PHD_SERVICE } from '../common/constants/service.js';
import type { AuthUser } from '../common/interface/auth-user.interface.js';
import { PERMISSIONS, ROLES } from '../../../../lib/contracts/src/permissions.js';
import { ListXetTotNghiepQueryDto, XacNhanCongNoDto, XacNhanNgoaiNguDto, XacNhanTotNghiepDto } from '../../../../lib/contracts/src/dto/graduation-assessment.dto.js';
import type { GraduatedNcsRecord } from '../../../../lib/contracts/src/dto/graduation-assessment.dto.js';
import { LimitHeavyRead } from '../common/decorators/rate-limit.decorator.js';
import { buildGraduationWorkbook } from './graduation-excel.js';

@Controller('graduation')
export class GraduationController {
    constructor(@Inject(PHD_SERVICE) private readonly phd: ClientProxy) { }

    private send<T>(cmd: string, payload: unknown, ms = 10000) {
        return firstValueFrom(this.phd.send<T>({ cmd }, payload).pipe(timeout(ms)));
    }
    // Giáo vụ xác nhận chuẩn đầu ra ngoại ngữ của NCS
    @Put('ncs/:ncsId/ngoai-ngu')
    @RequirePermissions(PERMISSIONS.GRADUATION_CHECK)
    xacNhanNgoaiNgu(
        @Param('ncsId', new ParseUUIDPipe()) ncsId: string,
        @CurrentUser() u: AuthUser,
        @Body() body: XacNhanNgoaiNguDto,
    ) {
        // Người xác nhận lấy từ token
        return this.send('phd.graduation.assessment.ngoai_ngu', { ncsId, dto: body, nguoiXacNhanId: u.id });
    }
    // Giáo vụ xác nhận NCS không còn công nợ
    @Put('ncs/:ncsId/cong-no')
    @RequirePermissions(PERMISSIONS.GRADUATION_CHECK)
    xacNhanCongNo(
        @Param('ncsId', new ParseUUIDPipe()) ncsId: string,
        @CurrentUser() u: AuthUser,
        @Body() body: XacNhanCongNoDto,
    ) {
        return this.send('phd.graduation.assessment.cong_no', { ncsId, dto: body, nguoiXacNhanId: u.id });
    }

    // Danh sách NCS đã xong các mốc, kèm kết quả từng điều kiện (lọc theo duDieuKien=true/false)
    @Get()
    @RequirePermissions(PERMISSIONS.GRADUATION_CHECK)
    list(@Query() q: ListXetTotNghiepQueryDto) {
        return this.send('phd.graduation.list', q);
    }

    @Get('graduated')
    @RequirePermissions(PERMISSIONS.GRADUATION_CHECK)
    @LimitHeavyRead()
    listGraduated(@CurrentUser() u: AuthUser) {
        if (!u.roles?.some((role) => role === ROLES.ADMIN || role === ROLES.GIAO_VU)) {
            throw new ForbiddenException('Chỉ giáo vụ và quản trị viên được xem danh sách NCS đã tốt nghiệp');
        }
        return this.send<GraduatedNcsRecord[]>('phd.graduation.graduated', {});
    }

    @Get('graduated/export')
    @RequirePermissions(PERMISSIONS.GRADUATION_CHECK)
    @LimitHeavyRead()
    async exportGraduated(@CurrentUser() u: AuthUser) {
        const records = await this.listGraduated(u);
        return new StreamableFile(await buildGraduationWorkbook(records), {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            disposition: 'attachment; filename="danh-sach-ncs-da-tot-nghiep.xlsx"',
        });
    }

    @Get('me')
    @RequirePermissions(PERMISSIONS.MILESTONE_READ)
    async myGraduation(@CurrentUser() u: AuthUser) {
        if (!u.roles?.includes(ROLES.NCS)) {
            throw new ForbiddenException('Chỉ NCS được xem hồ sơ tốt nghiệp cá nhân');
        }
        const data = await this.send<GraduatedNcsRecord | null>('phd.graduation.me', { userId: u.id });
        return { data };
    }

    // Xem kết quả xét tốt nghiệp của một NCS
    @Get('ncs/:ncsId')
    @RequirePermissions(PERMISSIONS.GRADUATION_CHECK)
    kiemTra(@Param('ncsId', new ParseUUIDPipe()) ncsId: string) {
        return this.send('phd.graduation.check', { ncsId });
    }

    // Giáo vụ xác nhận tốt nghiệp: lưu quyết định công nhận tốt nghiệp và chuyển NCS sang DA_TOT_NGHIEP
    @Post('confirm')
    @RequirePermissions(PERMISSIONS.GRADUATION_CHECK)
    xacNhanTotNghiep(@CurrentUser() u: AuthUser, @Body() body: XacNhanTotNghiepDto) {
        return this.send('phd.graduation.confirm', { ...body, nguoiXacNhanId: u.id });
    }

    // Quyết định công nhận tốt nghiệp còn hiệu lực và chưa dùng của một NCS (cho ô chọn quyết định khi xác nhận)
    @Get('ncs/:ncsId/quyet-dinh')
    @RequirePermissions(PERMISSIONS.GRADUATION_CHECK)
    quyetDinhChuaDung(@Param('ncsId', new ParseUUIDPipe()) ncsId: string) {
        return this.send('phd.graduation.decisions', { ncsId });
    }
}

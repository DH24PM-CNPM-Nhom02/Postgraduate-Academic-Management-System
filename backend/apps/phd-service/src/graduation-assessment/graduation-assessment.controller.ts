import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GraduationAssessmentService } from './graduation-assessment.service.js';
import { ListXetTotNghiepQueryDto, XacNhanCongNoDto, XacNhanNgoaiNguDto } from '../../../../lib/contracts/src/dto/graduation-assessment.dto.js';
import type { XacNhanTotNghiepDto } from '../../../../lib/contracts/src/dto/graduation-assessment.dto.js';

@Controller()
export class GraduationAssessmentController {
    constructor(private readonly graduation: GraduationAssessmentService) { }

    @MessagePattern({ cmd: 'phd.graduation.assessment.ngoai_ngu' })
    xacNhanNgoaiNgu(@Payload() d: {
        ncsId: string;
        dto: XacNhanNgoaiNguDto
        nguoiXacNhanId: string;
    }) {
        return this.graduation.xacNhanNgoaiNgu(d.ncsId, d.dto, d.nguoiXacNhanId);
    }

    @MessagePattern({ cmd: 'phd.graduation.assessment.cong_no' })
    xacNhanCongNo(@Payload() d: {
        ncsId: string;
        dto: XacNhanCongNoDto;
        nguoiXacNhanId: string;
    }) {
        return this.graduation.xacNhanCongNo(d.ncsId, d.dto, d.nguoiXacNhanId);
    }

    @MessagePattern({ cmd: 'phd.graduation.check' })
    kiemTra(@Payload() d: { ncsId: string }) {
        return this.graduation.kiemTra(d.ncsId);
    }

    @MessagePattern({ cmd: 'phd.graduation.list' })
    danhSach(@Payload() d: ListXetTotNghiepQueryDto) {
        return this.graduation.danhSach(d);
    }

    @MessagePattern({ cmd: 'phd.graduation.graduated' })
    danhSachDaTotNghiep() {
        return this.graduation.danhSachDaTotNghiep();
    }

    @MessagePattern({ cmd: 'phd.graduation.me' })
    hoSoTotNghiepCaNhan(@Payload() d: { userId: string }) {
        return this.graduation.hoSoTotNghiepCaNhan(d.userId);
    }

    @MessagePattern({ cmd: 'phd.graduation.confirm' })
    xacNhanTotNghiep(@Payload() d: XacNhanTotNghiepDto & { nguoiXacNhanId: string }) {
        return this.graduation.xacNhanTotNghiep(d);
    }

    @MessagePattern({ cmd: 'phd.graduation.decisions' })
    quyetDinhChuaDung(@Payload() d: { ncsId: string }) {
        return this.graduation.danhSachQuyetDinhChuaDung(d.ncsId);
    }

}

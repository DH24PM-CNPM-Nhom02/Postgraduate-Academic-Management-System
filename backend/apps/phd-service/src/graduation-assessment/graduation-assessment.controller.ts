import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GraduationAssessmentService } from './graduation-assessment.service.js';
import { XacNhanCongNoDto, XacNhanNgoaiNguDto } from '../../../../lib/contracts/src/dto/graduation-assessment.dto.js';

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
    danhSach(@Payload() d: { duDieuKien?: string }) {
        return this.graduation.danhSach(d);
    }

    @MessagePattern({ cmd: 'phd.graduation.confirm' })
    xacNhanTotNghiep(@Payload() d: {
        nguoiXacNhanId: string;
        danhSach: { ncsId: string; quyetDinhId: string; ngayTotNghiep?: string }[];
    }) {
        return this.graduation.xacNhanTotNghiep(d);
    }

}
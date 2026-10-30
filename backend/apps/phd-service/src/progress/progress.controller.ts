import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProgressService } from './progress.service.js';
import { DeadlineService } from './deadline.service.js';

@Controller()
export class ProgressController {
    constructor(
        private readonly progress: ProgressService,
        private readonly deadline: DeadlineService,
    ) { }

    @MessagePattern({ cmd: 'phd.progress.submit' })
    submit(@Payload() d: { userId: string; thuTu: number; fileId: string; ghiChu?: string }) {
        return this.progress.nopMinhChung(d.userId, d.thuTu, d.fileId, d.ghiChu);
    }

    @MessagePattern({ cmd: 'phd.progress.my' })
    getMyProgress(@Payload() d: { userId: string }) {
        return this.progress.tienTrinhCuaToi(d.userId);
    }
    @MessagePattern({ cmd: 'phd.progress.pending' })
    getListProgressPending() {
        return this.progress.danhSachChoDuyet();
    }
    @MessagePattern({ cmd: 'phd.progress.ncs' })
    getProgressOfNcs(@Payload() d: { ncsId: string }) {
        return this.progress.tienTrinhCuaNcs(d.ncsId);
    }

    @MessagePattern({ cmd: 'phd.progress.approve' })
    duyet(@Payload() d: { actorId: string; tienTrinhId: string; quyetDinhId: string }) {
        return this.progress.duyetMoc(d.actorId, d.tienTrinhId, d.quyetDinhId);
    }

    @MessagePattern({ cmd: 'phd.progress.reject' })
    tuChoi(@Payload() d: { actorId: string; tienTrinhId: string; lyDo: string }) {
        return this.progress.tuChoiMoc(d.actorId, d.tienTrinhId, d.lyDo);
    }

    @MessagePattern({ cmd: 'phd.evaluation.create' })
    nhapPhieu(@Payload() d: {
        actorId: string; minhChungId: string; tenNguoiCham: string;
        donViNguoiCham?: string; diem: number; nhanXet?: string; xacNhanTrung?: boolean;
    }) {
        return this.progress.nhapPhieuNhanXet(d);
    }

    @MessagePattern({ cmd: 'phd.evaluation.list' })
    danhSachPhieu(@Payload() d: { minhChungId: string }) {
        return this.progress.danhSachPhieu(d.minhChungId);
    }

    @MessagePattern({ cmd: 'phd.progress.plan-deadline' })
    datHanKeHoach(@Payload() d: { actorId: string; tienTrinhId: string; hanKeHoach: string | null }) {
        return this.deadline.datHanKeHoach(d.actorId, d.tienTrinhId, d.hanKeHoach);
    }
}
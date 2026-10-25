import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProgressService } from './progress.service.js';

@Controller()
export class ProgressController {
    constructor(private readonly progress: ProgressService) { }

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
}
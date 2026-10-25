import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DecisionService } from './decision.service.js';

@Controller()
export class DecisionController {
  constructor(private readonly decision: DecisionService) {}

  @MessagePattern({ cmd: 'phd.decision.create' })
  createDecision(@Payload() d: {
    nguoiTaoId: string; loai: string; soQuyetDinh: string; ngayQuyetDinh: string;
    ncsId?: string; fileId?: string; ghiChu?: string;
  }) {
    return this.decision.create(d);
  }

  @MessagePattern({ cmd: 'phd.decision.list' })
  getListDecision(@Payload() d: { ncsId?: string; loai?: string; trangThai?: string }) {
    return this.decision.getListDecision(d);
  }

  @MessagePattern({ cmd: 'phd.decision.get' })
  getDecisionById(@Payload() d: { id: string }) {
    return this.decision.getDecisionById(d.id);
  }

  @MessagePattern({ cmd: 'phd.decision.deactivate' })
  deactivateDecision(@Payload() d: { id: string; lyDo: string }) {
    return this.decision.deactivateDecision(d.id, d.lyDo);
  }
}
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { CreateMajorDto, UpdateMajorDto } from '../../../../lib/contracts/src/dto/ncs-catalog.dto.js';
import { TrainingMajorService } from './training-major.service.js';

@Controller()
export class TrainingMajorController {
  constructor(private readonly service: TrainingMajorService) {}

  @MessagePattern({ cmd: 'phd.ncs.catalog.majors' })
  list() {
    return this.service.list();
  }

  @MessagePattern({ cmd: 'phd.ncs.catalog.majors.get' })
  get(@Payload() { id }: { id: number }) {
    return this.service.get(id);
  }

  @MessagePattern({ cmd: 'phd.ncs.catalog.majors.create' })
  create(@Payload() { data }: { data: CreateMajorDto }) {
    return this.service.create(data);
  }

  @MessagePattern({ cmd: 'phd.ncs.catalog.majors.update' })
  update(@Payload() { id, data }: { id: number; data: UpdateMajorDto }) {
    return this.service.update(id, data);
  }

  @MessagePattern({ cmd: 'phd.ncs.catalog.majors.delete' })
  delete(@Payload() { id }: { id: number }) {
    return this.service.delete(id);
  }
}

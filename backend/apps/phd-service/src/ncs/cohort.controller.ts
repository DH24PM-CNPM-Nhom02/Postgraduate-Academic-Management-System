import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { CreateCohortDto, UpdateCohortDto } from '../../../../lib/contracts/src/dto/ncs-catalog.dto.js';
import { CohortService } from './cohort.service.js';

@Controller()
export class CohortController {
  constructor(private readonly service: CohortService) {}

  @MessagePattern({ cmd: 'phd.ncs.catalog.cohorts' })
  list() {
    return this.service.list();
  }

  @MessagePattern({ cmd: 'phd.ncs.catalog.cohorts.get' })
  get(@Payload() { id }: { id: string }) {
    return this.service.get(id);
  }

  @MessagePattern({ cmd: 'phd.ncs.catalog.cohorts.create' })
  create(@Payload() { data }: { data: CreateCohortDto }) {
    return this.service.create(data);
  }

  @MessagePattern({ cmd: 'phd.ncs.catalog.cohorts.update' })
  update(@Payload() { id, data }: { id: string; data: UpdateCohortDto }) {
    return this.service.update(id, data);
  }

  @MessagePattern({ cmd: 'phd.ncs.catalog.cohorts.delete' })
  delete(@Payload() { id }: { id: string }) {
    return this.service.delete(id);
  }
}

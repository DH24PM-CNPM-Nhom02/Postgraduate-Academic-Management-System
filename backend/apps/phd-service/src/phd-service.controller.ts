import { Controller, Get } from '@nestjs/common';
import { PhdServiceService } from './phd-service.service.js';

@Controller()
export class PhdServiceController {
  constructor(private readonly phdServiceService: PhdServiceService) {}

  @Get()
  getHello(): string {
    return this.phdServiceService.getHello();
  }
}

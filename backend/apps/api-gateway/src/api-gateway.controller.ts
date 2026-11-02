import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service.js';
import { Public } from './common/decorators/public.decorator.js';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Public()
  @Get(['health', 'api/v1/health'])
  health() {
    return this.apiGatewayService.getHealth();
  }

  @Public()
  @Get(['ping', 'api/v1/ping'])
  ping() {
    return this.apiGatewayService.pingServices();
  }
}

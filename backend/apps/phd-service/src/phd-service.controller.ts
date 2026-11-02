import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PhdServiceController {
  @MessagePattern({ cmd: 'ping' })
  @MessagePattern('ping')
  ping() {
    return 'pong';
  }
}

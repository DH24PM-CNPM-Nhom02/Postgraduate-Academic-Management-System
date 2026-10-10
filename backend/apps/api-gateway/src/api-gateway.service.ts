import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ApiGatewayService {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  getHello() {
    return this.authClient.send({ cmd: 'ping' }, {});
  }
}

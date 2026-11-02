import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('PHD_SERVICE') private readonly phdClient: ClientProxy,
    @Inject('DOCUMENT_SERVICE') private readonly documentClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  async pingServices() {
    const services = [
      { name: 'AUTH_SERVICE', client: this.authClient },
      { name: 'PHD_SERVICE', client: this.phdClient },
      { name: 'DOCUMENT_SERVICE', client: this.documentClient },
      { name: 'NOTIFICATION_SERVICE', client: this.notificationClient },
    ];

    const serviceResults: Record<
      string,
      { status: 'up' | 'down'; message?: string; latencyMs?: number; error?: string }
    > = {};

    await Promise.all(
      services.map(async ({ name, client }) => {
        const start = Date.now();
        try {
          const res = await firstValueFrom(
            client.send({ cmd: 'ping' }, {}).pipe(timeout(3000)),
          );
          serviceResults[name] = {
            status: 'up',
            message: res,
            latencyMs: Date.now() - start,
          };
        } catch (err: any) {
          serviceResults[name] = {
            status: 'down',
            error: err.message || 'Connection failed or timed out',
            latencyMs: Date.now() - start,
          };
        }
      }),
    );

    const isAllUp = Object.values(serviceResults).every((s) => s.status === 'up');

    return {
      status: isAllUp ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: serviceResults,
    };
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class PhdServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}

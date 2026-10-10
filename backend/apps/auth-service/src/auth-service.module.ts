import { Module } from '@nestjs/common';
import { AuthController } from './auth-service.controller.js';
import { AuthService} from './auth-service.service.js';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthCronService } from './auth-cron.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import type { StringValue } from 'ms';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
     JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRES') as StringValue,
        },
      }),
      inject: [ConfigService],
     }), 
     PrismaModule,
     ScheduleModule.forRoot(),
     
    ],
  controllers: [AuthController],
  providers: [AuthService, AuthCronService],
})
export class AuthServiceModule {}

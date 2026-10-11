import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service.js";
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class AuthCronService {
  private readonly logger = new Logger(AuthCronService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanTokens() {
    const oneDayAgo = new Date(Date.now() - 24 * 3600 * 1000);
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null, lt: oneDayAgo } }] },
    });
    this.logger.log(`Đã xóa ${count} refresh token rác`);
  }
}
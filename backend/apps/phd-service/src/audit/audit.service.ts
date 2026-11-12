import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service.js';
import { paginatePrisma } from '../helpers/pagination.util.js';
import { goiService } from '../helpers/call-service.util.js';
import type { AuditLogItemDto, ListAuditQueryDto } from '../../../../lib/contracts/src/dto/audit.dto.js';
import type { PaginatedResult } from '../../../../lib/contracts/src/dto/pagination.dto.js';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('AUTH_SERVICE') private readonly auth: ClientProxy,
  ) {}

  async getListAudit(q: ListAuditQueryDto): Promise<AuditLogItemDto[] | PaginatedResult<AuditLogItemDto>> {
    const where: any = {};

    if (q.action) {
      where.action = { contains: q.action };
    }

    if (q.entityType) {
      where.entityType = { contains: q.entityType };
    }

    if (q.entityId) {
      where.entityId = q.entityId;
    }

    if (q.actorId) {
      where.actorId = q.actorId;
    }

    if (q.ncsId) {
      where.ncsId = q.ncsId;
    }

    if (q.fromDate || q.toDate) {
      const createdAt: any = {};
      if (q.fromDate) {
        const from = new Date(q.fromDate);
        if (!isNaN(from.getTime())) {
          createdAt.gte = from;
        }
      }
      if (q.toDate) {
        const to = new Date(q.toDate);
        if (!isNaN(to.getTime())) {
          if (q.toDate.length <= 10) {
            to.setHours(23, 59, 59, 999);
          }
          createdAt.lte = to;
        }
      }
      if (createdAt.gte || createdAt.lte) {
        where.createdAt = createdAt;
      }
    }

    const term = (q.search || q.keyword)?.trim();
    if (term) {
      // Tìm NCS tương ứng theo mshv hoặc họ tên
      const matchingNcs = await this.prisma.nghienCuuSinh.findMany({
        where: {
          OR: [
            { mshv: { contains: term } },
            { hoTen: { contains: term } },
          ],
        },
        select: { id: true },
        take: 50,
      });
      const matchedNcsIds = matchingNcs.map((n) => n.id);

      where.OR = [
        { action: { contains: term } },
        { entityType: { contains: term } },
        { entityId: { contains: term } },
        { actorId: { contains: term } },
        ...(matchedNcsIds.length > 0 ? [{ ncsId: { in: matchedNcsIds } }] : []),
      ];
    }

    const result = await paginatePrisma(this.prisma.auditLog, {
      page: q.page,
      limit: q.limit,
      where,
      orderBy: { createdAt: 'desc' },
    });

    const logs: any[] = Array.isArray(result) ? result : result.data;
    const enriched = await this.enrichLogs(logs);

    if (Array.isArray(result)) {
      return enriched;
    }

    return {
      ...result,
      data: enriched,
    };
  }

  async getAuditById(id: string): Promise<AuditLogItemDto> {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new RpcException({
        statusCode: 404,
        message: 'Không tìm thấy nhật ký kiểm toán',
      });
    }

    const [enriched] = await this.enrichLogs([log]);
    return enriched;
  }

  private async enrichLogs(logs: any[]): Promise<AuditLogItemDto[]> {
    if (!logs.length) return [];

    const actorIds = [...new Set(logs.map((l) => l.actorId).filter(Boolean))];
    const ncsIds = [...new Set(logs.map((l) => l.ncsId).filter(Boolean))];

    // Tra cứu NCS
    const ncsMap = new Map<string, { id: string; mshv: string; hoTen: string }>();
    if (ncsIds.length > 0) {
      const ncsList = await this.prisma.nghienCuuSinh.findMany({
        where: { id: { in: ncsIds } },
        select: { id: true, mshv: true, hoTen: true },
      });
      for (const n of ncsList) {
        ncsMap.set(n.id, n);
      }
    }

    // Tra cứu Actor từ auth-service
    const actorMap = new Map<string, any>();
    if (actorIds.length > 0) {
      try {
        const actors = await goiService<any[]>(
          this.auth,
          'auth.find-users-by-ids',
          { ids: actorIds },
          5000,
        );
        if (Array.isArray(actors)) {
          for (const a of actors) {
            actorMap.set(a.id, a);
          }
        }
      } catch (err: any) {
        this.logger.warn(`Không thể lấy thông tin người dùng từ auth-service: ${err?.message || err}`);
      }
    }

    return logs.map((item) => ({
      ...item,
      actor: actorMap.get(item.actorId) ?? null,
      ncs: item.ncsId ? (ncsMap.get(item.ncsId) ?? null) : null,
    }));
  }
}

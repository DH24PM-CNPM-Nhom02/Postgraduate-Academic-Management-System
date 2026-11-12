import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditService } from './audit.service.js';
import { AuditController } from './audit.controller.js';
import { RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('AuditService & AuditController', () => {
  let service: AuditService;
  let controller: AuditController;
  let mockPrisma: any;
  let mockAuth: any;

  const mockLogs = [
    {
      id: 'log-1',
      actorId: 'user-admin',
      action: 'NCS_STATUS_UPDATE',
      entityType: 'NghienCuuSinh',
      entityId: 'ncs-1',
      ncsId: 'ncs-1',
      oldValue: { trangThai: 'DANG_HOC' },
      newValue: { trangThai: 'GIA_HAN' },
      clientIp: '127.0.0.1',
      correlationId: 'corr-1',
      createdAt: new Date('2026-11-10T10:00:00Z'),
    },
    {
      id: 'log-2',
      actorId: 'user-admin',
      action: 'THESIS_ASSIGN',
      entityType: 'DeTai',
      entityId: 'detai-1',
      ncsId: 'ncs-2',
      oldValue: {},
      newValue: { tenDeTai: 'Nghiên cứu AI trong y tế' },
      clientIp: '127.0.0.1',
      correlationId: 'corr-2',
      createdAt: new Date('2026-11-11T12:00:00Z'),
    },
  ];

  beforeEach(() => {
    mockPrisma = {
      auditLog: {
        findMany: vi.fn().mockResolvedValue(mockLogs),
        findUnique: vi.fn().mockImplementation(({ where }) => {
          const found = mockLogs.find((l) => l.id === where.id);
          return Promise.resolve(found || null);
        }),
        count: vi.fn().mockResolvedValue(mockLogs.length),
      },
      nghienCuuSinh: {
        findMany: vi.fn().mockImplementation(({ where }) => {
          if (where?.id?.in) {
            return Promise.resolve([
              { id: 'ncs-1', mshv: '2024NCS001', hoTen: 'Nguyễn Văn A' },
              { id: 'ncs-2', mshv: '2024NCS002', hoTen: 'Trần Thị B' },
            ]);
          }
          if (where?.OR) {
            return Promise.resolve([
              { id: 'ncs-1' },
            ]);
          }
          return Promise.resolve([]);
        }),
      },
    };

    mockAuth = {
      send: vi.fn((pattern, payload) => {
        if (pattern.cmd === 'auth.find-users-by-ids') {
          return of([
            {
              id: 'user-admin',
              username: 'admin',
              fullName: 'Quản trị hệ thống',
              email: 'admin@school.edu.vn',
              roles: ['ADMIN'],
            },
          ]);
        }
        return of([]);
      }),
    };

    service = new AuditService(mockPrisma, mockAuth);
    controller = new AuditController(service);
  });

  describe('getListAudit', () => {
    it('trả về mảng thuần enriched khi không truyền page/limit (client-side table)', async () => {
      const result = await service.getListAudit({});

      expect(Array.isArray(result)).toBe(true);
      const list = result as any[];
      expect(list).toHaveLength(2);
      expect(list[0].actor).toEqual({
        id: 'user-admin',
        username: 'admin',
        fullName: 'Quản trị hệ thống',
        email: 'admin@school.edu.vn',
        roles: ['ADMIN'],
      });
      expect(list[0].ncs).toEqual({
        id: 'ncs-1',
        mshv: '2024NCS001',
        hoTen: 'Nguyễn Văn A',
      });
    });

    it('trả về PaginatedResult khi truyền page và limit (server-side pagination)', async () => {
      const result = await service.getListAudit({ page: 1, limit: 10 });

      expect(Array.isArray(result)).toBe(false);
      const paginated = result as any;
      expect(paginated.page).toBe(1);
      expect(paginated.limit).toBe(10);
      expect(paginated.total).toBe(2);
      expect(paginated.totalPages).toBe(1);
      expect(paginated.data).toHaveLength(2);
      expect(paginated.data[0].actor.username).toBe('admin');
    });

    it('áp dụng đúng bộ lọc action, entityType, actorId, date range', async () => {
      await service.getListAudit({
        action: 'STATUS_UPDATE',
        entityType: 'NghienCuuSinh',
        actorId: 'user-admin',
        fromDate: '2026-11-01',
        toDate: '2026-11-12',
      });

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: { contains: 'STATUS_UPDATE' },
            entityType: { contains: 'NghienCuuSinh' },
            actorId: 'user-admin',
            createdAt: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        }),
      );
    });

    it('tìm kiếm theo keyword/search quét qua action, entity, actor và tra cứu NCS', async () => {
      await service.getListAudit({
        search: 'Nguyễn Văn A',
      });

      expect(mockPrisma.nghienCuuSinh.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { mshv: { contains: 'Nguyễn Văn A' } },
            { hoTen: { contains: 'Nguyễn Văn A' } },
          ],
        },
        select: { id: true },
        take: 50,
      });

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { action: { contains: 'Nguyễn Văn A' } },
              { entityType: { contains: 'Nguyễn Văn A' } },
              { entityId: { contains: 'Nguyễn Văn A' } },
              { actorId: { contains: 'Nguyễn Văn A' } },
              { ncsId: { in: ['ncs-1'] } },
            ]),
          }),
        }),
      );
    });

    it('không bị lỗi và trả logs với actor null khi auth-service gặp sự cố', async () => {
      mockAuth.send.mockReturnValue(throwError(() => new Error('Service unavailable')));

      const result = await service.getListAudit({});
      const list = result as any[];
      expect(list).toHaveLength(2);
      expect(list[0].actor).toBeNull();
      expect(list[0].ncs).toBeDefined();
    });
  });

  describe('getAuditById', () => {
    it('lấy chi tiết audit log và enrich thông tin', async () => {
      const result = await service.getAuditById('log-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('log-1');
      expect(result.actor?.username).toBe('admin');
      expect(result.ncs?.mshv).toBe('2024NCS001');
    });

    it('ném RpcException 404 khi không tìm thấy audit log', async () => {
      await expect(service.getAuditById('non-existent')).rejects.toThrow(RpcException);
    });
  });

  describe('AuditController', () => {
    it('getListAudit điều hướng đúng đến service.getListAudit', async () => {
      const spy = vi.spyOn(service, 'getListAudit').mockResolvedValue(mockLogs as any);
      const query = { page: 1, limit: 10 };

      const res = await controller.getListAudit(query);
      expect(spy).toHaveBeenCalledWith(query);
      expect(res).toEqual(mockLogs);
    });

    it('getAuditById điều hướng đúng đến service.getAuditById', async () => {
      const spy = vi.spyOn(service, 'getAuditById').mockResolvedValue(mockLogs[0] as any);

      const res = await controller.getAuditById({ id: 'log-1' });
      expect(spy).toHaveBeenCalledWith('log-1');
      expect(res).toEqual(mockLogs[0]);
    });
  });
});

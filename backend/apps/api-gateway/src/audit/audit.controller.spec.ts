import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditController } from './audit.controller.js';
import { of } from 'rxjs';

describe('Gateway AuditController', () => {
  let controller: AuditController;
  let mockPhd: any;

  beforeEach(() => {
    mockPhd = {
      send: vi.fn((pattern, payload) => {
        if (pattern.cmd === 'phd.audit.list') {
          return of({ data: [{ id: 'log-1' }], total: 1, page: 1, limit: 10, totalPages: 1 });
        }
        if (pattern.cmd === 'phd.audit.get') {
          return of({ id: payload.id, action: 'NCS_STATUS_UPDATE' });
        }
        return of(null);
      }),
    };

    controller = new AuditController(mockPhd);
  });

  it('gọi phd.audit.list với đúng query', async () => {
    const q = { page: 1, limit: 10, action: 'NCS_STATUS_UPDATE' };
    const res = await controller.list(q as any);

    expect(mockPhd.send).toHaveBeenCalledWith({ cmd: 'phd.audit.list' }, q);
    expect(res).toEqual({ data: [{ id: 'log-1' }], total: 1, page: 1, limit: 10, totalPages: 1 });
  });

  it('gọi phd.audit.get với đúng id', async () => {
    const res = await controller.detail('00000000-0000-0000-0000-000000000001');

    expect(mockPhd.send).toHaveBeenCalledWith(
      { cmd: 'phd.audit.get' },
      { id: '00000000-0000-0000-0000-000000000001' },
    );
    expect(res).toEqual({ id: '00000000-0000-0000-0000-000000000001', action: 'NCS_STATUS_UPDATE' });
  });
});

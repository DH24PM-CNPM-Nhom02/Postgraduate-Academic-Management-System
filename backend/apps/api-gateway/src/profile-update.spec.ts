import { ForbiddenException, ValidationPipe } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import ExcelJS from 'exceljs';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { UpdateMyAccountProfileDto } from '../../../lib/contracts/src/dto/auth.dto.js';
import { UpdateGvhdDto } from '../../../lib/contracts/src/dto/gvhd.dto.js';
import { UpdateMyNcsProfileDto } from '../../../lib/contracts/src/dto/ncs.dto.js';
import { UpdateContactProfileDto } from '../../../lib/contracts/src/dto/profile.dto.js';
import { ROLES } from '../../../lib/contracts/src/permissions.js';
import { AuthController } from './auth/auth.controller.js';
import type { PermissionsService } from './auth/services/permissions.service.js';
import { PERMISSIONS_KEY } from './common/decorators/require-permissions.decorator.js';
import { GvhdController } from './gvhd/gvhd.controller.js';
import { buildGvhdTemplate, parseGvhdExcel } from './gvhd/gvhd-excel.js';
import { NcsController } from './ncs/ncs.controller.js';

function authUser(role: string) {
  return { id: 'actor-id', username: 'actor', roles: [role], mustChangePassword: false };
}

describe('Profile updates at the gateway', () => {
  const validate = new ValidationPipe({ whitelist: true, transform: true });

  it('allows NCS to update their own contact fields without the staff read permission', async () => {
    const send = vi.fn(() => of({}));
    const controller = new NcsController({ send } as unknown as ClientProxy);
    const body = await validate.transform(
      { email: ' new@example.org ', soDienThoai: ' 0901234567 ', hoTen: 'Ignored', userId: 'another-user' },
      { type: 'body', metatype: UpdateMyNcsProfileDto },
    );
    expect(Reflect.getMetadata(PERMISSIONS_KEY, NcsController.prototype.updateMe)).toBeUndefined();
    await controller.updateMe(authUser(ROLES.NCS), body);
    expect(send).toHaveBeenCalledWith(
      { cmd: 'phd.ncs.update-me' },
      { userId: 'actor-id', duLieu: { email: 'new@example.org', soDienThoai: '0901234567' } },
    );
    expect(() => controller.updateMe(authUser(ROLES.GVHD), body)).toThrow(ForbiddenException);
  });

  it('validates supervisor phone numbers in both the self-service and staff DTOs', async () => {
    for (const metatype of [UpdateContactProfileDto, UpdateGvhdDto]) {
      const metadata = { type: 'body' as const, metatype };
      await expect(validate.transform({ soDienThoai: '091234567' }, metadata)).rejects.toThrow();
      await expect(validate.transform({ soDienThoai: 901234567 }, metadata)).rejects.toThrow();
      await expect(validate.transform({ soDienThoai: ' 0901234567 ' }, metadata)).resolves.toMatchObject({ soDienThoai: '0901234567' });
    }

    const send = vi.fn(() => of({}));
    const controller = new GvhdController({ send } as unknown as ClientProxy);
    await controller.updateMe(authUser(ROLES.GVHD), { soDienThoai: '0901234567' });
    expect(send).toHaveBeenCalledWith({ cmd: 'phd.gvhd.update-me' }, { userId: 'actor-id', data: { soDienThoai: '0901234567' } });
    expect(() => controller.updateMe(authUser(ROLES.NCS), {})).toThrow(ForbiddenException);
  });

  it('allows Admin and Giáo vụ to save account details and rejects NCS and GVHD', async () => {
    const send = vi.fn(() => of({}));
    const controller = new AuthController({ send } as unknown as ClientProxy, {} as PermissionsService);
    const metadata = { type: 'body' as const, metatype: UpdateMyAccountProfileDto };
    await expect(validate.transform({ email: 'bad' }, metadata)).rejects.toThrow();
    await expect(validate.transform({ fullName: '  ' }, metadata)).rejects.toThrow();
    const body = await validate.transform(
      { fullName: ' Nguyễn Văn An ', email: 'an@example.org', roles: [ROLES.ADMIN] },
      metadata,
    );
    for (const role of [ROLES.ADMIN, ROLES.GIAO_VU]) {
      await controller.updateMe(authUser(role), body);
    }
    expect(send).toHaveBeenCalledTimes(2);
    expect(send).toHaveBeenCalledWith(
      { cmd: 'auth.update-me' },
      { userId: 'actor-id', dto: { fullName: 'Nguyễn Văn An', email: 'an@example.org' } },
    );
    for (const role of [ROLES.NCS, ROLES.GVHD]) {
      expect(() => controller.updateMe(authUser(role), body)).toThrow(ForbiddenException);
    }
  });
});

describe('Supervisor import phone column', () => {
  it('round-trips a phone number with its zero and accepts a workbook without the column', async () => {
    const workbook = new ExcelJS.Workbook();
    const template = await buildGvhdTemplate();
    await workbook.xlsx.load(template as unknown as ArrayBuffer);
    const sheet = workbook.worksheets[0];
    const headers = sheet.getRow(1);
    const phoneColumn = headers.values instanceof Array ? headers.values.indexOf('Số điện thoại') : -1;
    expect(phoneColumn).toBeGreaterThan(0);
    expect(sheet.getCell(2, phoneColumn).numFmt).toBe('@');
    const row = sheet.getRow(2);
    row.getCell(1).value = 'D123456.123456';
    row.getCell(2).value = 'Nguyễn Văn An';
    row.getCell(phoneColumn).value = '0901234567';
    const rows = await parseGvhdExcel(Buffer.from(await workbook.xlsx.writeBuffer()));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ soDienThoai: '0901234567', hocHamHocVi: 'TIEN_SI' });

    sheet.spliceColumns(phoneColumn, 1);
    const legacyRows = await parseGvhdExcel(Buffer.from(await workbook.xlsx.writeBuffer()));
    expect(legacyRows).toHaveLength(1);
    expect(legacyRows[0]).toMatchObject({ soDienThoai: '', maGv: 'D123456.123456' });
  });
});

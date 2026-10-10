/// <reference types="node" />
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // This is for backend/.env
dotenv.config(); // This is for local .env if any

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PERMISSIONS, ROLES } from '../../../lib/contracts/src/permissions.js';

const databaseUrl = process.env.AUTH_DATABASE_URL;
if (!databaseUrl) throw new Error('Thiếu AUTH_DATABASE_URL trong .env');

const parsed = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: parsed.hostname,
  port: Number(parsed.port) || 3306,
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.replace(/^\//, ''),
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

const P = PERMISSIONS;

const rolePermissions: Record<string, string[]> = {
  [ROLES.ADMIN]: Object.values(P),
  [ROLES.GIAO_VU]: [
    P.USER_READ, P.USER_CREATE, P.USER_UPDATE,
    P.MILESTONE_READ, P.MILESTONE_APPROVE, P.MILESTONE_REJECT,
    P.QUOTA_READ, P.QUOTA_UPDATE,
    P.THESIS_CHANGE_APPROVE, P.GRADUATION_CHECK,
  ],
  [ROLES.GVHD]: [P.MILESTONE_READ, P.QUOTA_READ],
  [ROLES.NCS]: [P.MILESTONE_READ, P.MILESTONE_SUBMIT, P.THESIS_CHANGE_CREATE],
};

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) throw new Error('Thiếu SEED_ADMIN_PASSWORD trong .env');

  // 1. Permissions
  for (const name of Object.values(P)) {
    await prisma.permission.upsert({ where: { name }, update: {}, create: { name } });
  }

  // 2. Roles + gán permission
  for (const [roleName, perms] of Object.entries(rolePermissions)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, isSystemRole: true },
    });
    const found = await prisma.permission.findMany({ where: { name: { in: perms } } });
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: found.map((p:any) => ({ roleId: role.id, permissionId: p.id })),
    });
  }
  console.log('finished') // 3. Tài khoản admin đầu tiên
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      fullName: 'Quản trị hệ thống',
      password: await bcrypt.hash(adminPassword, 10),
      mustChangePassword: true,
      roles: { create: { role: { connect: { name: ROLES.ADMIN } } } },
    },
  });

  console.log('Seed xong');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());


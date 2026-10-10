import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './src/generated/prisma/index.js';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const databaseUrl = process.env.AUTH_DATABASE_URL;
  const url = new URL(databaseUrl);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: 5,
  });

  const prisma = new PrismaClient({ adapter });
  await prisma.$connect();
  const result = await prisma.$queryRaw`SELECT DATABASE() AS database`;
  console.log('✅ TEST SCRIPT SUCCESS. Connected database:', result[0]?.database);
  await prisma.$disconnect();
}
main().catch(console.error);

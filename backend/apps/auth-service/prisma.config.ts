import * as dotenv from 'dotenv';
import * as path from 'path';
import { defineConfig } from '@prisma/config';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: 'prisma/migrations',
    seed: 'node --import tsx --experimental-global-webcrypto prisma/seed.ts',
  },
  datasource: {
    url: process.env.AUTH_DATABASE_URL,
  },
});

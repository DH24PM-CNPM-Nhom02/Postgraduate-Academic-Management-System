import * as dotenv from 'dotenv';
import * as path from 'path';
import { defineConfig } from '@prisma/config';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DOCUMENT_DATABASE_URL,
  },
});

#!/bin/sh
# Chạy trong container dev. Mỗi lần (re)start:
#  1. Đồng bộ schema Prisma của service lên DB riêng của nó (db push)
#  2. Generate lại Prisma client (ghi vào apps/<service>/src/generated, đã mount từ máy host)
#  3. Chạy Nest ở chế độ watch
set -e

if [ "$APP_NAME" != "api-gateway" ]; then
  cd "apps/$APP_NAME"
  npx prisma db push || echo "[dev-start] prisma db push lỗi, vẫn tiếp tục"
  npx prisma generate
  cd /app
fi

exec npx nest start "$APP_NAME" --watch
# syntax=docker/dockerfile:1

# ---- BUILD: đủ dependencies, generate Prisma Client, build Nest ----
FROM node:22-alpine AS build

WORKDIR /app

# Prisma cần openssl trên alpine
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Generate Prisma Client cho từng service bằng prisma.config.ts của service đó.
# prisma generate không kết nối DB, nên dùng URL giả để config resolve được biến môi trường.
RUN for svc in auth-service phd-service document-service notification-service; do \
      (cd apps/$svc && \
       AUTH_DATABASE_URL=mysql://x:x@localhost:3306/x \
       PHD_DATABASE_URL=mysql://x:x@localhost:3306/x \
       DOCUMENT_DATABASE_URL=mysql://x:x@localhost:3306/x \
       NOTIFICATION_DATABASE_URL=mysql://x:x@localhost:3306/x \
       npx prisma generate --config prisma.config.ts); \
    done

# Build toàn bộ app ra /app/dist
# CHỈNH thành đúng lệnh build cũ của repo nếu khác, để giữ layout dist/apps/<app>/apps/<app>/src/main.js
RUN npm run build


# ---- DATABASE INIT: Prisma CLI + source schema/config + seed ----
FROM build AS db-init

ENV NODE_ENV=production

# Stage build đã có source code, node_modules đầy đủ và Prisma CLI.
# Giữ nguyên dependencies để chạy được Prisma và tsx khi seed.
# Compose ghi đè working_dir và command, ví dụ (auth-init):
#   working_dir: /app/apps/auth-service
#   command: sh -c "npx prisma db push --config prisma.config.ts && npx prisma db seed --config prisma.config.ts"
CMD ["sh", "-c", "npx prisma --version"]


# ---- RUNTIME: Stage cuối, CI build mặc định sẽ dùng stage này ----
FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

ARG APP_NAME=api-gateway
ENV APP_NAME=${APP_NAME}

COPY --from=build /app/dist ./dist

# Prisma Client đã generate ở stage build
COPY --from=build /app/apps/auth-service/src/generated ./dist/apps/auth-service/apps/auth-service/src/generated
COPY --from=build /app/apps/phd-service/src/generated ./dist/apps/phd-service/apps/phd-service/src/generated
COPY --from=build /app/apps/document-service/src/generated ./dist/apps/document-service/apps/document-service/src/generated
COPY --from=build /app/apps/notification-service/src/generated ./dist/apps/notification-service/apps/notification-service/src/generated

EXPOSE 8080 3001 3002 3003 3004

CMD ["sh", "-c", "node dist/apps/${APP_NAME}/apps/${APP_NAME}/src/main.js"]
# syntax=docker/dockerfile:1

# ---- DEV: dùng cho docker compose dev, chạy Nest watch + Prisma db push/generate ----
FROM node:22-alpine AS dev

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN sed -i 's/\r$//' ./docker/dev-start.sh && chmod +x ./docker/dev-start.sh

ARG APP_NAME=api-gateway
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=development

EXPOSE 8080 3001 3002 3003 3004

CMD ["sh", "-c", "./docker/dev-start.sh"]

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

# Build đủ 5 app, mỗi app ra dist/apps/<app>/main.js
RUN for app in api-gateway auth-service phd-service document-service notification-service; do \
      npx nest build "$app"; \
    done


# ---- DATABASE INIT: Prisma CLI + source schema/config + seed ----
FROM build AS db-init

ENV NODE_ENV=production

# Stage build đã có source code, node_modules đầy đủ và Prisma CLI.
# Giữ nguyên dependencies để chạy được Prisma và tsx khi seed.
# Compose ghi đè working_dir và command.
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

EXPOSE 8080 3001 3002 3003 3004

CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main.js"]
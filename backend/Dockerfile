# ---- DATABASE INIT: Prisma CLI + source schema/config + seed ----
FROM build AS db-init

ENV NODE_ENV=production

# Stage build đã có source code, node_modules đầy đủ và Prisma CLI.
# Giữ nguyên dependencies để chạy được Prisma và tsx khi seed.
CMD ["sh", "-c", "npx prisma --version"]


# ---- RUNTIME: Stage cuối, CI build mặc định sẽ dùng stage này ----
FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

ARG APP_NAME=api-gateway
ENV APP_NAME=${APP_NAME}

COPY --from=build /app/dist ./dist

# Prisma Client đã generate
COPY --from=build /app/apps/auth-service/src/generated ./dist/apps/auth-service/apps/auth-service/src/generated
COPY --from=build /app/apps/phd-service/src/generated ./dist/apps/phd-service/apps/phd-service/src/generated
COPY --from=build /app/apps/document-service/src/generated ./dist/apps/document-service/apps/document-service/src/generated
COPY --from=build /app/apps/notification-service/src/generated ./dist/apps/notification-service/apps/notification-service/src/generated

EXPOSE 8080 3001 3002 3003 3004

CMD ["sh", "-c", "node dist/apps/${APP_NAME}/apps/${APP_NAME}/src/main.js"]
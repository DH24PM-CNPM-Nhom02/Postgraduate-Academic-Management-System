FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG APP_NAME=api-gateway
RUN AUTH_DATABASE_URL=mysql://pams_user:pams_password@mariadb:3306/auth_db \
    PHD_DATABASE_URL=mysql://pams_user:pams_password@mariadb:3306/phd_db \
    DOCUMENT_DATABASE_URL=mysql://pams_user:pams_password@mariadb:3306/document_db \
    NOTIFICATION_DATABASE_URL=mysql://pams_user:pams_password@mariadb:3306/notification_db \
    npm run prisma:generate \
    && npm run build -- "${APP_NAME}" --builder tsc

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

ARG APP_NAME=api-gateway
ENV APP_NAME=${APP_NAME}
COPY --from=build /app/dist ./dist
COPY --from=build /app/apps/auth-service/src/generated ./dist/apps/auth-service/apps/auth-service/src/generated
COPY --from=build /app/apps/phd-service/src/generated ./dist/apps/phd-service/apps/phd-service/src/generated
COPY --from=build /app/apps/document-service/src/generated ./dist/apps/document-service/apps/document-service/src/generated
COPY --from=build /app/apps/notification-service/src/generated ./dist/apps/notification-service/apps/notification-service/src/generated

EXPOSE 3000
CMD ["sh", "-c", "node dist/apps/${APP_NAME}/apps/${APP_NAME}/src/main.js"]

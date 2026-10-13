FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS dev

COPY . .

ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

FROM dependencies AS build

COPY . .

# NEXT_PUBLIC_* được nhúng vào bundle lúc build, nên phải nhận qua build-arg (CI truyền vào)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# Nếu repo có next.config.(js|mjs|ts) thì bỏ comment dòng dưới, `next start` cần đọc nó lúc chạy:
# COPY --from=build /app/next.config.* ./

EXPOSE 3000
CMD ["npm", "start"]
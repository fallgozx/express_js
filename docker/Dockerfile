FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install

COPY prisma ./prisma/
RUN bunx prisma generate

COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/server.ts"]

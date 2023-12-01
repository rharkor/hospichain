FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .
COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]

FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN yarn

RUN npm prisma db pull

RUN npx prisma generate

COPY . .

RUN npx prisma db pull && npm run start:dev
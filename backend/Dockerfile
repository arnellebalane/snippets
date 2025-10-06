FROM node:22.20.0-slim

WORKDIR /snippets

RUN apt-get update -y && apt-get install -y openssl

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npx prisma generate

CMD ["npm", "start"]

FROM node:20.19.2-alpine

WORKDIR /snippets

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npx prisma generate

CMD ["npm", "start"]

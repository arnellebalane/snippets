FROM node:10.15

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

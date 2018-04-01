FROM node:8.10

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY source ./source
COPY etc ./etc

EXPOSE 3000

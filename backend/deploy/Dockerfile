FROM --platform=linux/amd64 node:14.18.0-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["deploy/entrypoint.sh"]

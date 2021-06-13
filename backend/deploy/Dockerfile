FROM node:14.17.0

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["deploy/entrypoint.sh"]

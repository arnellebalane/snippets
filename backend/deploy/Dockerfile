FROM node:10.15

WORKDIR /app

COPY package*.json ./
RUN rm -rf frontend
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["backend/deploy/entrypoint.sh"]

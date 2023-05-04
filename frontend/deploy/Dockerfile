# 1st stage: Build the frontend code with npm
FROM --platform=linux/amd64 node:14.18.0-slim as builder

WORKDIR /app

ARG SNIPPETS_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# 2nd stage: Copy build output to nginx root
FROM --platform=linux/amd64 nginx:1.13

COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html

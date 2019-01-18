# 1st stage: Build the frontend code with npm
FROM node:10.15 as builder

WORKDIR /app

ARG SNIPPETS_API_URL
ENV SNIPPETS_API_URL=$SNIPPETS_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN rm -rf backend
RUN npm run build:frontend


# 2nd stage: Copy build output to nginx root
FROM nginx:1.13

COPY frontend/deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/frontend/build /usr/share/nginx/html

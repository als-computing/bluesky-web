FROM node:18-alpine AS builder

WORKDIR /frontend
COPY package*.json /frontend/
RUN npm ci
COPY . /frontend/
RUN npm run build

FROM nginx:1.26-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /frontend/build/ /usr/share/nginx/html/
COPY nginx/nginx.conf /etc/nginx/nginx.conf
#EXPOSE 80


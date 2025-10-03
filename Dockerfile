FROM node:lts-alpine AS node
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=node /app/build /usr/share/nginx/html
COPY nginx /etc/nginx
EXPOSE 80

FROM node:alpine as build
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx /etc/nginx
RUN apk add --no-cache tzdata
ENV TZ=Europe/Moscow
EXPOSE 80

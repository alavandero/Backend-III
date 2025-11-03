FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY ./src ./src
COPY ./Swagger ./Swagger

EXPOSE 8080

CMD ["node", "src/app.js"]
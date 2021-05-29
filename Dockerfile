FROM node:14.16.1-alpine3.13 as frontend

WORKDIR /app

COPY frontend/package*.json ./

RUN npm i

COPY frontend/ ./

RUN ls -l

RUN npm run build

FROM node:14.16.1-alpine3.13 as backend

WORKDIR /app

EXPOSE 80

RUN mkdir uploads frontend

COPY package*.json ./

RUN npm i

COPY express.js ./

COPY --from=frontend /app/build frontend/build

ENV port=80

CMD node express.js

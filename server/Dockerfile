FROM node:18-alpine

RUN apk add --no-cache tzdata

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3002

RUN mkdir -p public/uploads
COPY public/uploads/ public/uploads/

RUN chmod -R 777 public/uploads

CMD ["npm", "start"]

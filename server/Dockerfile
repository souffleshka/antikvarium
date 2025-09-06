FROM node:18-alpine

RUN apk add --no-cache tzdata

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3002

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN mkdir -p public/uploads
COPY public/uploads/ public/uploads/

RUN chown -R nodejs:nodejs /app
RUN chmod -R 775 public/uploads

USER nodejs

CMD ["npm", "start"]

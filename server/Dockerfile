# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем tzdata для поддержки часовых поясов
RUN apk add --no-cache tzdata

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Создаем директорию для загрузок
RUN mkdir -p public/uploads

# Копируем изображения в контейнер
COPY public/uploads/ public/uploads/

# Открываем порт 3002
EXPOSE 3002

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Меняем владельца файлов
RUN chown -R nodejs:nodejs /app
USER nodejs

# Запускаем приложение
CMD ["npm", "start"]

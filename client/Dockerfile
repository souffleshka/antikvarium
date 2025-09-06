# Используем официальный Node.js образ
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock (если есть)
COPY package.json yarn.lock* ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем исходный код
COPY . .

# Собираем приложение для продакшена
RUN yarn build

# Используем nginx для раздачи статических файлов
FROM nginx:alpine

# Копируем собранное приложение
COPY --from=0 /app/build /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]

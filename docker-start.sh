#!/bin/bash

# Скрипт для запуска Antikvarium в Docker

echo "🚀 Запуск Antikvarium в Docker..."

# Проверяем, что Docker запущен
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker не запущен. Пожалуйста, запустите Docker Desktop."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Собираем и запускаем
echo "🔨 Сборка и запуск контейнеров..."
docker-compose up --build -d

# Ждем запуска сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Проверяем статус
echo "📊 Статус сервисов:"
docker-compose ps

echo ""
echo "✅ Antikvarium запущен!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend API: http://localhost:3002"
echo "   • MongoDB: localhost:27017"
echo ""
echo "👤 Данные для входа:"
echo "   • Username: admin"
echo "   • Password: ADMIN_12345"
echo "   • Email: admin@antikvarium.com"
echo ""
echo "📝 Для просмотра логов: docker-compose logs [service_name]"
echo "🛑 Для остановки: docker-compose down"

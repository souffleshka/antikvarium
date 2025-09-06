# Docker Setup для Antikvarium

## Описание
Этот проект настроен для запуска в Docker контейнерах с автоматической инициализацией данных.

## Структура сервисов
- **mongodb**: База данных MongoDB
- **server**: Backend API (Node.js/Express)
- **client**: Frontend (React)
- **admin-init**: Создание админа при первом запуске
- **data-init**: Инициализация тестовых данных

## Порты
- **3000**: Frontend (React)
- **3002**: Backend API
- **27017**: MongoDB

## Данные для входа
- **Админ**: 
  - Username: `admin`
  - Password: `ADMIN_12345`
  - Email: `admin@antikvarium.com`

## Запуск

### Первый запуск
```bash
# Сборка и запуск всех сервисов
docker-compose up --build

# Или в фоновом режиме
docker-compose up --build -d
```

### Обычный запуск
```bash
docker-compose up
```

### Остановка
```bash
docker-compose down
```

### Полная очистка (включая данные)
```bash
docker-compose down -v
docker system prune -f
```

## Особенности

### Автоматическая инициализация
1. При первом запуске создается админ с данными выше
2. Автоматически загружаются тестовые лоты
3. При редеплое данные очищаются и создаются заново

### Часовые пояса
- Все контейнеры настроены на московское время (Europe/Moscow)
- Таймеры торгов работают корректно без сдвига на 3 часа
- Сервер создает даты в московском часовом поясе

### Volumes
- `mongodb_data`: Постоянное хранение данных MongoDB
- `./server/public/uploads:/app/public/uploads`: Монтирование изображений

### Сеть
Все сервисы работают в изолированной сети `antikvarium-network`

## Логи
Для просмотра логов конкретного сервиса:
```bash
docker-compose logs [service_name]
# Например:
docker-compose logs server
docker-compose logs mongodb
```

## Troubleshooting

### Если порты заняты
Проверьте занятые порты:
```bash
lsof -i :3000  # клиент
lsof -i :3002  # сервер  
lsof -i :27017 # MongoDB
```

### Пересборка после изменений
```bash
docker-compose down
docker-compose up --build
```

### Очистка кэша Docker
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

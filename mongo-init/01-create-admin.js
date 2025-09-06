// Скрипт для создания админа в MongoDB
db = db.getSiblingDB('Dream_Nest');

// Создаем коллекцию users если её нет
db.createCollection('users');

// Создаем админа
db.users.insertOne({
  username: "admin",
  email: "admin@antikvarium.com",
  password: "$2a$10$LNFtBTW770SgXxjXnIoX7eCSIbViPyM3vS8B/L3tcACDbQ6wiPpWi", // ADMIN_12345
  isAdmin: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print("✅ Админ создан: username=admin, password=password");

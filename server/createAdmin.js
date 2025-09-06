const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "Dream_Nest",
    });
    console.log("Connected to MongoDB");

    // Проверяем, существует ли уже админ
    const existingAdmin = await User.findOne({ 
      $or: [
        { username: "admin" }, 
        { email: "admin@antikvarium.com" }
      ] 
    });

    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log("Username:", existingAdmin.username);
      console.log("Email:", existingAdmin.email);
      console.log("Is Admin:", existingAdmin.isAdmin);
      return;
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash("ADMIN_12345", salt);

    // Создаем админа
    const admin = new User({
      username: "admin",
      email: "admin@antikvarium.com",
      password: hashedPassword,
      isAdmin: true,
    });

    // Сохраняем в базу данных
    await admin.save();
    
    console.log("Admin created successfully!");
    console.log("Username: admin");
    console.log("Email: admin@antikvarium.com");
    console.log("Password: ADMIN_12345");
    console.log("Is Admin: true");

  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    // Закрываем соединение
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Запускаем скрипт
createAdmin();

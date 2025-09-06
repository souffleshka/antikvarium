const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const User = require("./models/User");
const Lot = require("./models/Lot");

const lotsData = [
  {
    image: "book.jpg",
    title: "Редкая антикварная книга",
    description: "Старинная книга в кожаном переплете, изданная в начале XX века. Отличное состояние, все страницы на месте. Идеально подходит для коллекционеров старинных изданий.",
    startPrice: 150
  },
  {
    image: "chair.jpg", 
    title: "Винтажное кресло",
    description: "Элегантное кресло в стиле ар-деко 1930-х годов. Деревянная основа с оригинальной обивкой. Уникальный предмет мебели для ценителей винтажного дизайна.",
    startPrice: 300
  },
  {
    image: "jug.jpg",
    title: "Фарфоровый кувшин",
    description: "Антикварный фарфоровый кувшин с ручной росписью. Изготовлен в конце XIX века. Изысканный декор и отличное состояние делают его ценным экспонатом.",
    startPrice: 200
  },
  {
    image: "lamp.jpg",
    title: "Бронзовая настольная лампа",
    description: "Роскошная бронзовая лампа с абажуром из шелка. Создана в стиле модерн начала XX века. Функциональная и декоративная одновременно.",
    startPrice: 250
  },
  {
    image: "newspaper.jpg",
    title: "Историческая газета",
    description: "Оригинальная газета от 9 мая 1945 года с объявлением о Победе. Редкий исторический документ в отличном состоянии. Ценный артефакт для коллекционеров.",
    startPrice: 500
  },
  {
    image: "old_clock.jpg",
    title: "Антикварные настенные часы",
    description: "Старинные механические часы с деревянным корпусом. Работают исправно, имеют красивый циферблат. Созданы в начале XX века мастером-часовщиком.",
    startPrice: 400
  },
  {
    image: "phonograph.jpg",
    title: "Патефон 1920-х годов",
    description: "Редкий патефон в рабочем состоянии. Деревянный корпус с металлическим рупором. Идеально подходит для воспроизведения старых граммофонных пластинок.",
    startPrice: 800
  },
  {
    image: "photo_camera.jpg",
    title: "Фотоаппарат Leica 1950-х",
    description: "Классический фотоаппарат Leica в отличном состоянии. Полный комплект с объективом и кожаным чехлом. Мечта любого коллекционера фототехники.",
    startPrice: 1200
  },
  {
    image: "picture.jpg",
    title: "Картина маслом",
    description: "Антикварная картина маслом на холсте. Пейзаж в стиле импрессионизма. Подпись художника и дата создания - 1910 год. Оригинальная рама включена.",
    startPrice: 600
  },
  {
    image: "samovar.jpg",
    title: "Русский самовар",
    description: "Традиционный русский самовар из латуни. Изготовлен в Туле в конце XIX века. Отличное состояние, все детали на месте. Символ русской культуры.",
    startPrice: 350
  },
  {
    image: "statuette.jpg",
    title: "Бронзовая статуэтка",
    description: "Изящная бронзовая статуэтка в стиле ар-нуво. Изображает танцующую фигуру. Создана французским скульптором в начале XX века. Высота 25 см.",
    startPrice: 450
  }
];

const createLots = async () => {
  try {
    // Подключение к базе данных
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "Dream_Nest",
    });
    
    console.log("Подключение к базе данных установлено");

    // Находим админа
    const admin = await User.findOne({ isAdmin: true });
    if (!admin) {
      console.error("Админ не найден! Сначала создайте админа.");
      return;
    }

    console.log(`Найден админ: ${admin.username}`);

    // Создаем лоты
    for (let i = 0; i < lotsData.length; i++) {
      const lotData = lotsData[i];
      
      // Генерируем случайную дату окончания (от 1 до 30 дней от текущей даты)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 1);
      
      const lot = new Lot({
        title: lotData.title,
        description: lotData.description,
        startPrice: lotData.startPrice,
        currentPrice: lotData.startPrice,
        endDate: endDate,
        imageUrl: `public/uploads/${lotData.image}`,
        status: "active",
        creator: admin._id
      });

      await lot.save();
      console.log(`✅ Создан лот: ${lotData.title} (окончание: ${endDate.toLocaleDateString()})`);
    }

    console.log(`\n🎉 Успешно создано ${lotsData.length} лотов!`);
    
  } catch (error) {
    console.error("Ошибка при создании лотов:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Соединение с базой данных закрыто");
  }
};

// Запускаем создание лотов
createLots();

require('dotenv').config(); // Загружаем переменные окружения
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Импорт маршрутов
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require("./routes/userRoutes");

// Инициализация приложения
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Маршруты API
app.use("/api/users", userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Подключение к MongoDB
const connectDB = async () => {
    try {
        console.log("🔍 Подключение к MongoDB..." );
        console.log("🔍 MONGO_URI:", process.env.MONGO_URI); // Проверяем, загружена ли переменная
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB подключен');
    } catch (err) {
        console.error('❌ Ошибка подключения к MongoDB:', err);
        process.exit(1); // Завершаем процесс при ошибке подключения
    }
};

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

// Обработчик ошибок 404 (если маршрут не найден)
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не найден" });
});

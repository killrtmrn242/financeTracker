const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Разрешаем CORS для Live Server (порт 5500)
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

app.use(express.json()); // Разбираем JSON-тело запросов

// Подключаем маршруты
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

module.exports = app;

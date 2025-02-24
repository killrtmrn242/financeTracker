const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("📥 Получен запрос на регистрацию:", { username, password });

    if (!username || !password) {
      return res.status(400).json({ message: "❌ Заполните все поля" });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "❌ Пользователь уже существует" });
    }

    // Не хешируем пароль вручную, так как pre-hook модели выполнит хеширование
    const user = new User({ username, password });
    await user.save();

    console.log("✅ Пользователь создан:", user);
    res.status(201).json({ message: "✅ Регистрация успешна!" });
  } catch (error) {
    console.error("❌ Ошибка регистрации:", error);
    res.status(500).json({ message: "❌ Ошибка сервера" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("🔍 Полученный логин:", username);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    console.log("🛠️ Проверка пароля:", password, "vs", user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Совпадение паролей:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { username: user.username } });
  } catch (error) {
    console.error("❌ Ошибка при входе:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

const updateUsername = async (req, res) => {
  try {
    const { newUsername } = req.body;
    const userId = req.user.id;
    console.log("📝 Запрос на смену логина:", { userId, newUsername });

    if (!newUsername) {
      return res.status(400).json({ message: "❌ Новый логин не указан" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "❌ Пользователь не найден" });
    }

    if (user.username === newUsername) {
      return res.status(400).json({ message: "❌ Новый логин совпадает с текущим" });
    }

    const usernameExists = await User.findOne({ username: newUsername });
    if (usernameExists) {
      return res.status(400).json({ message: "❌ Этот логин уже занят" });
    }

    user.username = newUsername;
    await user.save();

    console.log("✅ Логин успешно изменен:", user);
    res.json({ message: "✅ Логин успешно изменен", username: newUsername });
  } catch (error) {
    console.error("❌ Ошибка при смене логина:", error);
    res.status(500).json({ message: "❌ Ошибка сервера" });
  }
};

// Экспортируем все функции одним объектом
module.exports = {
  registerUser,
  loginUser,
  updateUsername,
};

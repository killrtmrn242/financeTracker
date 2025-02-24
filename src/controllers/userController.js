const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Логин не может быть пустым' });
    }

    // Проверяем, существует ли уже пользователь с таким логином
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(400).json({ error: 'Этот логин уже занят' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    user.username = username;
    const updatedUser = await user.save();

    res.json({ message: 'Логин обновлен', user: { username: updatedUser.username } });
  } catch (error) {
    console.error('❌ Ошибка обновления профиля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};

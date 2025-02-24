const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Нет токена' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) return res.status(401).json({ error: 'Пользователь не найден' });

        next();
    } catch (error) {
        res.status(401).json({ error: 'Неверный токен' });
    }
};

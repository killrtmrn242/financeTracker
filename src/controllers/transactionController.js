const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
  try {
    // Пример создания транзакции
    const transaction = new Transaction({ ...req.body, user: req.user.id });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    // Убедимся, что транзакция принадлежит текущему пользователю
    const transaction = await Transaction.findOne({ _id: id, user: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: "Транзакция не найдена" });
    }
    await Transaction.deleteOne({ _id: id });
    res.json({ message: "Транзакция успешно удалена" });
  } catch (error) {
    console.error("❌ Ошибка при удалении транзакции:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

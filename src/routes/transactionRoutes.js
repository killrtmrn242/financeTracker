const express = require('express');
const { createTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/', protect, getTransactions);
router.delete('/:id', protect, deleteTransaction);

module.exports = router;

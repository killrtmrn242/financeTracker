const express = require('express');
const { registerUser, loginUser, updateUsername } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update-username',protect,updateUsername);

module.exports = router;

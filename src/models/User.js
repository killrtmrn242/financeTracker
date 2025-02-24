const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Хешируем пароль перед сохранением, только если он ещё не хеширован
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.password.startsWith("$2a$10$")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);

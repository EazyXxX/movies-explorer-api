const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Передан невалидный email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      required: true,
      minlength: [2, 'Имя должно быть больше двух символов'],
      maxlength: [30, 'Имя должно быть меньше 30 символов'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);

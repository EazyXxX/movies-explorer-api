const users = require('express').Router();
const { signUpValidation, signInValidation, updateUserValidation } = require('../validation/validation');
const {
  signup, getUser, updateUser, signin, signOut,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
users.get('/me', getUser);
// обновляет информацию о пользователе (email и имя)
users.patch('/me', updateUserValidation, updateUser);

module.exports = users;

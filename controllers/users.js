const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const EmailExistsError = require('../errors/EmailExistsError');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  // достаём юзера из ДБшки
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError())
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError());
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  // достаём юзера из ДБшки
  User
    .findById(req.user._id)
    .orFail(new NotFoundError(`Пользователь с указанным id не найден ${req.user._id}`))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные профиля'));
      }
      next(err);
    });
};

const signup = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash,
    });
    return res.status(201).json({
      name: user.name,
      email: user.email,
      _id: user.id,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      console.error(err);
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } if (err.code === 11000) {
      return next(new EmailExistsError('Пользователь с таким email уже существует'));
    }
    console.error(err);
    return next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (user === null) {
      return next(new UnauthorizedError('Указанный пользователь не найден'));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError('Неправильный пароль'));
    }

    const token = jsonwebtoken.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ message: 'Токен сохранен в httpOnly кукис' });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const signOut = async (req, res, next) => {
  try {
    await res.clearCookie('jwt');
    return res.send({ message: 'Токен удален из кукиса' });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

module.exports = {
  signup, getUser, updateUser, signin, signOut,
};

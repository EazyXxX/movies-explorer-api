const index = require('express').Router();
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const users = require('./users');
const movies = require('./movies');
const authMiddleware = require('../middlewares/auth');
const { signUpValidation, signInValidation } = require('../validation/validation');
const { signup, signin, signOut } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { errorLogger, requestLogger } = require('../middlewares/logger');
const centralCatcher = require('../middlewares/centralCatcher');

index.use(requestLogger);

index.use(cookieParser());

index.post('/signup', signUpValidation, signup);
index.post('/signin', signInValidation, signin);

index.use(authMiddleware);

index.use('/users', users);
index.use('/movies', movies);
index.post('/signout', signOut);

index.use('*', (req, res, next) => {
  const err = new NotFoundError('Страница не существует');
  next(err);
});

index.use(errorLogger);

index.use(errors());
index.use(centralCatcher);

module.exports = index;

const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => { res.json(movies); })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError(`Фильм ${_id} не найден`);
      }
      if (movie.owner.toHexString() !== req.user._id) {
        throw new ConflictError('Нельзя удалять чужие фильмы.');
      }
      movie.deleteOne();
      return res.send({ message: `Фильм ${_id} удалён.` });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.error(err);
        return next(new BadRequestError('Передан некорректный id фильма'));
      }
      console.error(err);
      return next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};

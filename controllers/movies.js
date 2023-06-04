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

const deleteMovie = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const movie = await Movie.findById(_id);
    if (movie === null) {
      throw new NotFoundError(`Фильм ${_id} не найден`);
    }
    if (movie.owner.toHexString() !== req.user._id) {
      throw new ConflictError('Нельзя удалять чужие фильмы');
    }

    await movie.deleteOne();
    return res.send({ message: `Фильм ${_id} удалён` });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      console.error(err);
      return next(new BadRequestError('Передан некорректный id фильма'));
    }
    return next(err);
  }
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};

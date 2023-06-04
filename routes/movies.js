const movies = require('express').Router();
const {
  validateCreateMovie, validateDeleteMovie,
} = require('../validation/validation');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
movies.get('/', getMovies);
// создаёт фильм с переданными в теле параметрами
movies.post('/', validateCreateMovie, createMovie);
// удаляет сохранённый фильм по id
movies.delete('/:_id', validateDeleteMovie, deleteMovie);

module.exports = movies;

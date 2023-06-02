const mongoose = require('mongoose');
const { isURL } = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Необходимо указать страну создания фильма'],
    },
    director: {
      type: String,
      required: [true, 'Необходимо указать режиссёра фильма'],
    },
    duration: {
      type: Number,
      required: [true, 'Необходимо указать режиссёра фильма'],
    },
    year: {
      type: String,
      required: [true, 'Необходимо указать год выхода фильма'],
    },
    description: {
      type: String,
      required: [true, 'Необходимо указать описание фильма'],
    },
    image: {
      type: String,
      required: [true, 'Необходима ссылка на постер к фильму'],
      validate: {
        validator: (url) => isURL(url),
        message: 'Передан невалидный url адрес.',
      },
    },
    trailerLink: {
      type: String,
      required: [true, 'Необходима ссылка на трейлер к фильму'],
      validate: {
        validator: (url) => isURL(url),
        message: 'Передан невалидный url адрес.',
      },
    },

    thumbnail: {
      type: String,
      required: [true, 'Необходима миниатюра постера к фильму (thumbnail)'],
      validate: {
        validator: (url) => isURL(url),
        message: 'Передан невалидный url адрес.',
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Необходим id пользователя, сохранившего фильм'],
      ref: 'user',
    },

    movieId: {
      type: Number,
      required: [true, 'Необходим id фильма от MoviesExplorer'],
    },

    nameRU: {
      type: String,
      required: [true, 'Необходимо название фильма на русском'],
    },

    nameEN: {
      type: String,
      required: [true, 'Необходимо название фильма на русском'],
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);

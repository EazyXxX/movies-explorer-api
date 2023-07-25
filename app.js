const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const index = require('./routes/index');
const limiter = require('./middlewares/limiter');
const corsOptions = require('./middlewares/cors');

const { DB_ADDRESS, PORT } = process.env;

mongoose.set('strictQuery', false);
const app = express();
mongoose.set('runValidators', true);

mongoose.connect(DB_ADDRESS)
  .then(() => {
    app.listen(PORT, (error) => (error ? console.error(error) : console.log(`App listening on port ${PORT}`)));
    console.log('MongoDB is connected');
  })
  .catch(() => console.log('Connection failed'));

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(index);

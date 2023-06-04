const centralCatcher = (err, req, res, next) => {
  if (!err.statusCode) {
    console.log(err);
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
  console.log(err);
  res.status(err.statusCode).send({ message: err.message });
};

module.exports = centralCatcher;

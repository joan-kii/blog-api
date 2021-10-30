const express = require('express');
const createError = require('http-errors');
const compression = require('compression');
const helmet = require('helmet');

require('dotenv').config();

const app = express();
const routes = require('./routes');

app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

// Handle errors

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {

  const message = err.status === 404 ? 
    `The endpoint '${req.originalUrl}' does not exist` : 
    'Something went wrong on the server. Try it again later.';
    
  const error = {
    status: err.status || 500,
    endpoint: req.originalUrl,
    message: message
  };

  console.log(error);
  res.status(error.status);
  res.json(error);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App running!')
});

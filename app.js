const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error!'));

const app = express();
const indexRoute = require('./routes');
const postsRoute = require('./routes/post');
const adminRoute = require('./routes/admin');

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRoute);
app.use('/posts', postsRoute);
app.use('/admin', adminRoute);

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
    message: err.message
  };

  console.log(error);
  res.status(error.status);
  res.json(error);
});

app.listen(process.env.PORT || 5000, () => {
  console.log('App running!')
});

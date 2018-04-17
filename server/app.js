const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const routes = require('./routes');
const code = require('./utils/statusCodes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

routes(app);

// Custom middleware for error handling
app.use((error, req, res, next) => {
  res.status(code.USER_ERROR).send({ error });
});

module.exports = app;

const express = require('express');
const FriendsController = require('../controllers/friends');

const router = express.Router();

module.exports = (app) => {
  app.get('/');
};

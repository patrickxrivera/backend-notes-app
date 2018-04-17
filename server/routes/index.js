const express = require('express');
const passport = require('passport');

const UsersController = require('../controllers/users');
const { requireSignIn, requireAuth } = require('../services/tokenPassport');

const authOptns = passport.authenticate('google', {
  scope: ['profile', 'email']
});

module.exports = (app) => {
  app.get('/', UsersController.greeting);
  app.post('/signup', UsersController.signUp);
  app.post('/signin', requireSignIn, UsersController.signIn);
  app.get('/auth/google', authOptns);
  app.get('/auth/google/callback', passport.authenticate('google'));
};

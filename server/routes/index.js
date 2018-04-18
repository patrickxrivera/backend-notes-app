const express = require('express');
const passport = require('passport');

const UsersController = require('../controllers/users');
const { requireSignIn, requireAuth } = require('../services/tokenPassport');

const googleAuthOptns = passport.authenticate('google', {
  scope: ['profile', 'email']
});

module.exports = (app) => {
  app.get('/', UsersController.greeting);
  app.post('/api/signup', UsersController.signUp);
  app.post('/api/signin', requireSignIn, UsersController.signIn);
  app.get('/api/secret', requireAuth, UsersController.secret);
  app.get('/auth/google', googleAuthOptns);
  app.get('/auth/google/callback', passport.authenticate('google'));
};

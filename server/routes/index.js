const express = require('express');
const passport = require('passport');

const UsersController = require('../controllers/users');
const PagesController = require('../controllers/pages');
const { requireSignIn, requireAuth } = require('../services/tokenPassport');

const googleAuthOptns = passport.authenticate('google', {
  scope: ['profile', 'email']
});

module.exports = (app) => {
  // Users
  app.get('/', UsersController.greeting);
  app.post('/api/signup', UsersController.signUp);
  app.post('/api/signin', requireSignIn, UsersController.signIn);

  // Pages
  app.post('/api/page/new', requireAuth, PagesController.create);
  app.get('/api/pages', requireAuth, PagesController.read);
  app.put('/api/page', requireAuth, PagesController.update);
  app.delete('/api/page', requireAuth, PagesController.remove);

  // Google Auth
  app.get('/auth/google', googleAuthOptns);
  app.get('/auth/google/callback', passport.authenticate('google'));
};

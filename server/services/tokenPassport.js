const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../models/User');
const keys = require('../config/keys');

const localOptions = {
  usernameField: 'username'
};

const localLogin = new LocalStrategy(
  localOptions,
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);

      user.checkPassword(password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false);
        return done(null, user);
      });
    });
  }
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: keys.tokenSecret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findOne({ username: payload.sub }, (err, user) => {
    if (err) return done(err, false);
    if (user) return done(null, user);
    done(null, false);
  });
});

passport.use(localLogin);
passport.use(jwtLogin);

module.exports = {
  requireAuth: passport.authenticate('jwt', { session: false }),
  requireSignIn: passport.authenticate('local', { session: false })
};

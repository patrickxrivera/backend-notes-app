const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const curry = require('ramda/src/curry');
const { ExtractJwt } = require('passport-jwt');

const to = require('../utils/to');
const User = require('../models/User');
const keys = require('../config/keys');

const localOptions = {
  usernameField: 'username'
};

const localLogin = new LocalStrategy(localOptions, async (username, password, done) => {
  const [userErr, user] = await to(User.findOne({ username }));

  if (userErr) return done(userErr);
  if (!user) return done(null, false);

  user.checkPassword(password, (err, isMatch) => {
    if (err) return done(err);
    if (!isMatch) return done(null, false);

    return done(null, user);
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: keys.tokenSecret
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  const [err, user] = await to(User.findOne({ username: payload.sub }));

  if (err) return done(err, false);
  if (user) return done(null, user);

  done(null, false);
});

passport.use(localLogin);
passport.use(jwtLogin);

module.exports = {
  requireAuth: passport.authenticate('jwt', { session: false }),
  requireSignIn: passport.authenticate('local', { session: false })
};

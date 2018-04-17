const passport = require('passport');
const googlePassport = require('passport-google-oauth20');
const mongoose = require('mongoose');

const to = require('../utils/to');
const keys = require('../config/keys');

const User = mongoose.model('users');

const GoogleStrategy = googlePassport.Strategy;

const passportConfig = passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, { id, name }, done) => {
      const [findErr, existingUser] = await to(User.findOne({ googleId: id }));

      if (existingUser) {
        done(null, existingUser);
        return;
      }

      const { givenName, familyName } = name;
      const username = givenName.concat(familyName).toLowerCase();

      const [saveErr, savedUser] = await to(
        User.create({
          googleId: id,
          firstName: givenName,
          lastName: familyName,
          username
        })
      );

      done(null, savedUser);
    }
  )
);

module.exports = passportConfig;

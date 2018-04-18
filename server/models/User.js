const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PageSchema = require('./Page');

const SALT_ROUNDS = 11;
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }]
});

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.password, SALT_ROUNDS, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

UserSchema.methods.checkPassword = function(potentialPassword, cb) {
  bcrypt.compare(potentialPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('users', UserSchema);

module.exports = User;

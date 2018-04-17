const mongoose = require('mongoose');

const PageSchema = require('./Page');

const { Schema } = mongoose;

const UserSchema = new Schema({
  googleId: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    unique: true
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
  pages: { PageSchema }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;

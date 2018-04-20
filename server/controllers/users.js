const User = require('../models/User');
const code = require('../utils/statusCodes');
const createToken = require('../utils/createToken');

const INVALID_CREDENTIALS = 'You must provide a username and password';
const INVALID_USERNAME = 'Username already exists. Please try again.';

const greeting = (req, res) => {
  res.send({ hi: 'there' });
};

const signUp = async (req, res, next) => {
  const { firstName, username, password } = req.body;

  if (!username || !password) {
    next(INVALID_CREDENTIALS);
    return;
  }

  const user = await User.findOne({ username });

  if (user) {
    next(INVALID_USERNAME);
    return;
  }

  const newUser = await User.create({ firstName, username, password });

  res.send({
    firstName: newUser.firstName,
    userId: newUser._id,
    token: createToken(newUser)
  });
};

const signIn = ({ user }, res) => {
  res.send({
    firstName: user.firstName,
    username: user.username,
    userId: user._id,
    token: createToken(user)
  });
};

module.exports = {
  greeting,
  signUp,
  signIn
};

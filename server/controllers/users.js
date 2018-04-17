const User = require('../models/User');
const code = require('../utils/statusCodes');
const to = require('../utils/to');
const createToken = require('../utils/createToken');

const INVALID_CREDENTIALS = 'You must provide a username and password';
const INVALID_USERNAME = 'Username already exists. Please try again.';

const greeting = (req, res) => {
  res.send({ hi: 'there' });
};

const signUp = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next(INVALID_CREDENTIALS);
    return;
  }

  const user = await User.findOne({ username });

  if (user) {
    next(INVALID_USERNAME);
    return;
  }

  const newUser = await User.create({ username, password });

  res.send({ token: createToken(newUser) });
};

const signIn = (req, res) => {
  res.send({ success: true, token: createToken(req.user) });
};

module.exports = {
  greeting,
  signUp,
  signIn
};

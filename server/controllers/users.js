const User = require('../models/User');
const code = require('../utils/statusCodes');
const to = require('../utils/to');
const createToken = require('../utils/createToken');

const greeting = (req, res) => {
  res.send({ hi: 'there' });
};

const signUp = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(422).send({ error: 'You must provide a username and password' });
    return;
  }

  const [dbErr, user] = await to(User.findOne({ username }));

  if (dbErr) {
    res.status(422).send({ error: 'Database error on finding user' });
    return;
  }

  if (user) {
    res.status(422).send({ error: 'User already exists' });
    return;
  }

  const [saveErr, newUser] = await to(User.create({ username, password }));

  if (saveErr) {
    res.status(422).send({ error: `Can't save user` });
    return;
  }

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

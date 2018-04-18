const User = require('../models/User');
const code = require('../utils/statusCodes');
const to = require('../utils/to');

const create = async ({ user, body }, res) => {
  user.pages = [...user.pages, body];

  const updatedUser = await user.save();

  res.send(updatedUser);
};

module.exports = {
  create
};

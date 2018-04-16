const Friend = require('../models/Friend');
const code = require('../utils/statusCodes');
const to = require('../utils/to');

module.exports = {
  root(req, res) {
    res.send({ api: 'running' });
  }
};

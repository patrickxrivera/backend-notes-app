const jwt = require('jwt-simple');
const keys = require('../config/keys');

module.exports = ({ username }) => {
  const timestamp = new Date().getTime();
  return jwt.encode(
    {
      sub: username,
      iat: timestamp
    },
    keys.tokenSecret
  );
};

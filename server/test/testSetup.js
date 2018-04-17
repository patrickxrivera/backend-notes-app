// Access to env variables
require('dotenv').config();

const mongoose = require('mongoose');

module.exports = () => {
  let users;

  before((done) => {
    mongoose.connect('mongodb://localhost/notes-io-test');
    mongoose.connection.once('open', () => done()).on('error', (error) => {
      console.warn('Warning', error);
    });
  });

  before((done) => {
    users = mongoose.connection.collections.users;
    users
      .drop()
      .then(() => done())
      .catch(() => done());
  });

  after((done) => {
    users = mongoose.connection.collections.users;
    users
      .drop()
      .then(() => done())
      .catch(() => done());
  });
};

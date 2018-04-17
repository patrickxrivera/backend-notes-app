// Access to env variables
require('dotenv').config();

const mongoose = require('mongoose');

module.exports = () => {
  before((done) => {
    mongoose.connect('mongodb://localhost/notes-io-test');
    mongoose.connection.once('open', () => done()).on('error', (error) => {
      console.warn('Warning', error);
    });
  });

  beforeEach((done) => {
    const { users } = mongoose.connection.collections;
    users
      .drop()
      .then(() => done())
      .catch(() => done());
  });
};

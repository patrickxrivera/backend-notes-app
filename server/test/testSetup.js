const mongoose = require('mongoose');

module.exports = () => {
  before((done) => {
    mongoose
      .connect('mongodb://localhost/backend_notes_app_test')
      .then(() => {
        console.log('Connected to database');
      })
      .catch((err) => {
        console.log('Not connected to database!!!', err);
      });
    // mongoose.connection.once('open', () => done()).on('error', (error) => {
    //   console.warn('Warning', error);
    // });
  });

  beforeEach((done) => {
    const { friends } = mongoose.connection.collections;
    friends
      .drop()
      .then(() => done())
      .catch(() => done());
  });
};

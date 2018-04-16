const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect('mongodb://localhost/backend_notes_app', { useMongoClient: true })
    .then(() => {
      console.log('Connected to database');
    })
    .catch((err) => {
      console.log('Not connected to database!!!', err);
    });
}

if (!module.parent) {
  app.listen(port, () => console.log(`\n=== API up on port: ${port} ===\n`));
}

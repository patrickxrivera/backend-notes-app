const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/muber');
}

if (!module.parent) {
  app.listen(port, () => console.log(`\n=== API up on port: ${port} ===\n`));
}

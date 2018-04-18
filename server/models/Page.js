const mongoose = require('mongoose');

const { Schema } = mongoose;

const PageSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parentId: {
    type: Number,
    default: null
  },
  title: {
    type: String
  },
  emoji: {
    type: String
  },
  content: {
    type: String
  },
  updatedAt: {
    type: String
  },
  tags: {
    type: [String]
  }
});

module.exports = mongoose.model('Page', PageSchema);

const mongoose = require('mongoose');

const { Schema } = mongoose;

const PageSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  parentId: {
    type: Number,
    default: null,
    required: true,
    unique: true
  },
  title: {
    type: String
  },
  emoji: {
    type: String
  },
  updatedAt: {
    type: String
  },
  tags: {
    type: [String]
  }
});

module.exports = PageSchema;

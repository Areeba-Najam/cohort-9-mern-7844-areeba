const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      trim: true,
      default: '',
      maxlength: 20000,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      enum: ['default', 'peach', 'mint', 'blush', 'lavender', 'butter', 'sage'],
      default: 'default',
    },
  },
  { timestamps: true }
);
noteSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model('Note', noteSchema);
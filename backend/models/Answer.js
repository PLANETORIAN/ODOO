const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    editHistory: [
      {
        content: String,
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for vote count
answerSchema.virtual('voteCount').get(function () {
  return this.upvotes.length - this.downvotes.length;
});

// Ensure virtuals are serialized
answerSchema.set('toJSON', { virtuals: true });
answerSchema.set('toObject', { virtuals: true });

// Index for better query performance
answerSchema.index({ question: 1, createdAt: -1 });

module.exports = mongoose.model('Answer', answerSchema); 
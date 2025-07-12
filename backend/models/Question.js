const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
      minlength: 20,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    views: {
      type: Number,
      default: 0,
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'duplicate'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for vote count
questionSchema.virtual('voteCount').get(function () {
  return this.upvotes.length - this.downvotes.length;
});

// Virtual for answer count
questionSchema.virtual('answerCount').get(function () {
  return this.model('Answer').countDocuments({ question: this._id });
});

// Ensure virtuals are serialized
questionSchema.set('toJSON', { virtuals: true });
questionSchema.set('toObject', { virtuals: true });

// Index for search
questionSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Question', questionSchema); 
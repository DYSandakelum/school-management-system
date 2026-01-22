const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: [true, 'Please add submission content'],
    },

    attachments: [
      {
        filename: String,
        url: String,
      },
    ],

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    grade: {
      type: Number,
      min: 0,
    },

    feedback: {
      type: String,
    },

    status: {
      type: String,
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted',
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    gradedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submissions
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
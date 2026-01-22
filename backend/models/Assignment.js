const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add assignment title'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Please add description'],
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    class: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    dueDate: {
      type: Date,
      required: [true, 'Please add due date'],
    },

    totalMarks: {
      type: Number,
      default: 100,
    },

    attachments: [
      {
        filename: String,
        url: String,
      },
    ],

    instructions: {
      type: String,
    },

    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
assignmentSchema.index({ class: 1, dueDate: -1 });
assignmentSchema.index({ createdBy: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    class: {
      type: String,
      required: true,
      trim: true,
    },
    
    date: {
      type: Date,
      required: true,
    },
    
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
    },
    
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    notes: {
      type: String,
      trim: true,
    },
    
    period: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
attendanceSchema.index({ student: 1, date: -1 });
attendanceSchema.index({ class: 1, date: -1 });

// Prevent duplicate attendance for same student, date, and period
attendanceSchema.index(
  { student: 1, date: 1, period: 1 },
  { unique: true }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
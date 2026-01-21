const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getStudentAttendance,
  getMyAttendance,
  getClassAttendance,
  getStudentsForAttendance,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// Student routes
router.get('/my-attendance', protect, authorize('student'), getMyAttendance);

// Teacher/Principal routes
router.post('/mark', protect, authorize('teacher', 'principal'), markAttendance);
router.get('/students', protect, authorize('teacher', 'principal'), getStudentsForAttendance);
router.get('/class/:className/:date', protect, authorize('teacher', 'principal'), getClassAttendance);

// Common routes (with role-based access in controller)
router.get('/student/:studentId', protect, getStudentAttendance);

module.exports = router;
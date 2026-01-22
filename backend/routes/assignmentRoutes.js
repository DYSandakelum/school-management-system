const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getTeacherAssignments,
  getStudentAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

// Teacher/Principal routes
router.post('/', protect, authorize('teacher', 'principal'), createAssignment);
router.get('/teacher', protect, authorize('teacher', 'principal'), getTeacherAssignments);
router.put('/:id', protect, authorize('teacher', 'principal'), updateAssignment);
router.delete('/:id', protect, authorize('teacher', 'principal'), deleteAssignment);
router.get('/:id/submissions', protect, authorize('teacher', 'principal'), getAssignmentSubmissions);
router.put('/submissions/:id/grade', protect, authorize('teacher', 'principal'), gradeSubmission);

// Student routes
router.get('/student', protect, authorize('student'), getStudentAssignments);
router.post('/:id/submit', protect, authorize('student'), submitAssignment);

// Common routes
router.get('/:id', protect, getAssignment);

module.exports = router;
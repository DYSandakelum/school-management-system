const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Teacher, Principal)
exports.createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      class: className,
      dueDate,
      totalMarks,
      instructions,
    } = req.body;

    // Validation
    if (!title || !description || !subject || !className || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      subject,
      class: className,
      dueDate,
      totalMarks: totalMarks || 100,
      instructions,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all assignments (for teacher)
// @route   GET /api/assignments/teacher
// @access  Private (Teacher, Principal)
exports.getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    // Get submission count for each assignment
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const submissionCount = await Submission.countDocuments({
          assignment: assignment._id,
        });

        return {
          ...assignment.toObject(),
          submissionCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: assignmentsWithStats.length,
      data: assignmentsWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get assignments for student
// @route   GET /api/assignments/student
// @access  Private (Student)
exports.getStudentAssignments = async (req, res) => {
  try {
    // For now, get all active assignments
    // Later, filter by student's class
    const assignments = await Assignment.find({ status: 'active' })
      .sort({ dueDate: 1 })
      .populate('createdBy', 'name');

    // Check if student has submitted each assignment
    const assignmentsWithSubmission = await Promise.all(
      assignments.map(async (assignment) => {
        const submission = await Submission.findOne({
          assignment: assignment._id,
          student: req.user.id,
        });

        return {
          ...assignment.toObject(),
          hasSubmitted: !!submission,
          submission: submission || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: assignmentsWithSubmission.length,
      data: assignmentsWithSubmission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Teacher, Principal)
exports.updateAssignment = async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Make sure user is assignment owner
    if (assignment.createdBy.toString() !== req.user.id && req.user.role !== 'principal') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assignment',
      });
    }

    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Teacher, Principal)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Make sure user is assignment owner
    if (assignment.createdBy.toString() !== req.user.id && req.user.role !== 'principal') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assignment',
      });
    }

    await assignment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide submission content',
      });
    }

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignment: req.params.id,
      student: req.user.id,
    });

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.content = content;
      existingSubmission.submittedAt = Date.now();
      
      // Check if late
      if (new Date() > new Date(assignment.dueDate)) {
        existingSubmission.status = 'late';
      }

      await existingSubmission.save();

      return res.status(200).json({
        success: true,
        message: 'Assignment resubmitted successfully',
        data: existingSubmission,
      });
    }

    // Create new submission
    const submission = await Submission.create({
      assignment: req.params.id,
      student: req.user.id,
      content,
      status: new Date() > new Date(assignment.dueDate) ? 'late' : 'submitted',
    });

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private (Teacher, Principal)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.id,
    })
      .populate('student', 'name email admissionNo')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Grade submission
// @route   PUT /api/assignments/submissions/:id/grade
// @access  Private (Teacher, Principal)
exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';
    submission.gradedBy = req.user.id;
    submission.gradedAt = Date.now();

    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
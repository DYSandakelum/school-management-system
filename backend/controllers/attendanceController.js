const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc    Mark attendance
// @route   POST /api/attendance/mark
// @access  Private (Teacher, Principal)
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, class: className, date, status, notes, period } = req.body;

    // Validation
    if (!studentId || !className || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check if attendance already marked for this date and period
    const existingAttendance = await Attendance.findOne({
      student: studentId,
      date: new Date(date),
      period: period || 'full-day',
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.class = className;
      existingAttendance.notes = notes;
      existingAttendance.markedBy = req.user.id;
      
      await existingAttendance.save();

      return res.status(200).json({
        success: true,
        message: 'Attendance updated successfully',
        data: existingAttendance,
      });
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      student: studentId,
      class: className,
      date: new Date(date),
      status,
      markedBy: req.user.id,
      notes,
      period: period || 'full-day',
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get student attendance
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Build query
    const query = { student: studentId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    // Calculate statistics
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const excused = attendance.filter(a => a.status === 'excused').length;
    
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: attendance,
      statistics: {
        total,
        present,
        absent,
        late,
        excused,
        percentage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get my attendance (for logged-in student)
// @route   GET /api/attendance/my-attendance
// @access  Private (Student)
exports.getMyAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build query
    const query = { student: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    // Calculate statistics
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const excused = attendance.filter(a => a.status === 'excused').length;
    
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: attendance,
      statistics: {
        total,
        present,
        absent,
        late,
        excused,
        percentage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get class attendance for a specific date
// @route   GET /api/attendance/class/:className/:date
// @access  Private (Teacher, Principal)
exports.getClassAttendance = async (req, res) => {
  try {
    const { className, date } = req.params;

    const attendance = await Attendance.find({
      class: className,
      date: new Date(date),
    })
      .populate('student', 'name email admissionNo')
      .sort({ 'student.name': 1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all students for attendance marking
// @route   GET /api/attendance/students
// @access  Private (Teacher, Principal)
exports.getStudentsForAttendance = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isActive: true })
      .select('name email admissionNo')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
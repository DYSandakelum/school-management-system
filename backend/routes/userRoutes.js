const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Test route to create a user (keep for testing)
router.post('/test-create', async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
});

// Get all users - Protected (any authenticated user)
router.get('/all', protect, async (req, res) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

// Get all students - Only teachers and principals
router.get('/students', protect, authorize('teacher', 'principal'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all teachers - Only principal
router.get('/teachers', protect, authorize('principal'), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    
    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Test route to verify password hashing
router.get('/test-password/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        hashedPassword: user.password,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
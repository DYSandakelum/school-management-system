const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Test route to create a user
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

// Test route to get all users (without passwords)
router.get('/all', async (req, res) => {
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

// NEW: Test route to verify password hashing
router.get('/test-password/:id', async (req, res) => {
  try {
    // Get user WITH password (using .select('+password'))
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
        hashedPassword: user.password, // Show the hashed password
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
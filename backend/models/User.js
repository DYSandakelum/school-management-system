const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    
    // Role-based access
    role: {
      type: String,
      enum: ['student', 'teacher', 'principal', 'parent'],
      required: [true, 'Please specify a role'],
    },
    
    // Contact Information
    phoneNumber: {
      type: String,
      trim: true,
    },
    
    // Identification Numbers
    nic: {
      type: String,
      trim: true,
      sparse: true, // Allows multiple null values
    },
    
    admissionNo: {
      type: String,
      trim: true,
      sparse: true,
    },
    
    teacherId: {
      type: String,
      trim: true,
      sparse: true,
    },
    
    // Profile
    profilePicture: {
      type: String,
      default: 'default-avatar.png',
    },
    
    // Preferences
    preferredLanguage: {
      type: String,
      enum: ['sinhala', 'tamil', 'english'],
      default: 'sinhala',
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create and export the model
const User = mongoose.model('User', userSchema);

module.exports = User;
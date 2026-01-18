const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      select: false, // Don't return password by default in queries
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
      sparse: true,
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
    timestamps: true,
  }
);

// Middleware to hash password before saving
userSchema.pre('save', async function () {
  // Only hash the password if it's new or modified
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt (random data added to password)
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
const User = mongoose.model('User', userSchema);

module.exports = User;
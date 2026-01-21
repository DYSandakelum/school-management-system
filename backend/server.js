// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'School Management System API',
    status: 'Server is running successfully!',
    database: 'Connected to MongoDB'
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
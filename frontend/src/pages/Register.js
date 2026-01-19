import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phoneNumber: '',
    nic: '',
    admissionNo: '',
    teacherId: '',
    preferredLanguage: 'sinhala',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { name, email, password, confirmPassword, role, phoneNumber, preferredLanguage } = formData;

    // Validation
    if (!name || !email || !password || !role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Prepare data to send
    const userData = {
      name,
      email,
      password,
      role,
      phoneNumber,
      preferredLanguage,
    };

    // Add role-specific fields
    if (role === 'student' && formData.admissionNo) {
      userData.admissionNo = formData.admissionNo;
    }
    if (role === 'teacher' && formData.teacherId) {
      userData.teacherId = formData.teacherId;
    }
    if ((role === 'principal' || role === 'parent') && formData.nic) {
      userData.nic = formData.nic;
    }

    const result = await register(userData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>🏫 School Management System</h1>
          <h2>Create New Account</h2>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="principal">Principal</option>
                <option value="parent">Parent/Guardian</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preferredLanguage">Preferred Language *</label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                required
              >
                <option value="sinhala">Sinhala</option>
                <option value="tamil">Tamil</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="07XXXXXXXX"
            />
          </div>

          {/* Conditional Fields Based on Role */}
          {formData.role === 'student' && (
            <div className="form-group">
              <label htmlFor="admissionNo">Admission Number</label>
              <input
                type="text"
                id="admissionNo"
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleChange}
                placeholder="e.g., STU2024001"
              />
            </div>
          )}

          {formData.role === 'teacher' && (
            <div className="form-group">
              <label htmlFor="teacherId">Teacher ID</label>
              <input
                type="text"
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                placeholder="e.g., TCH2024001"
              />
            </div>
          )}

          {(formData.role === 'principal' || formData.role === 'parent') && (
            <div className="form-group">
              <label htmlFor="nic">NIC Number</label>
              <input
                type="text"
                id="nic"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                placeholder="e.g., 199012345678"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './RoleDashboards.css';

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🏫 School Management System</h1>
          <span className="role-badge student-badge">Student Portal</span>
        </div>
        <div className="header-right">
          <span className="user-name">👤 {user.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome back, {user.name}! 📚</h2>
          <p>Here's your student dashboard</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📖</div>
            <h3>My Classes</h3>
            <p>View your class schedule and subjects</p>
            <button className="card-btn">View Classes</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Assignments</h3>
            <p>Check and submit your assignments</p>
            <button className="card-btn">View Assignments</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>My Results</h3>
            <p>View your exam results and grades</p>
            <button className="card-btn">View Results</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Attendance</h3>
            <p>Check your attendance record</p>
            <button 
              className="card-btn"
              onClick={() => navigate('/attendance')}
            >
              View Attendance
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Study Materials</h3>
            <p>Access lesson notes and resources</p>
            <button className="card-btn">View Materials</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📢</div>
            <h3>Announcements</h3>
            <p>View school and class announcements</p>
            <button className="card-btn">View Announcements</button>
          </div>
        </div>

        <div className="info-section">
          <h3>📋 Student Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Admission No:</span>
              <span className="info-value">{user.admissionNo || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Language:</span>
              <span className="info-value">{user.preferredLanguage}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
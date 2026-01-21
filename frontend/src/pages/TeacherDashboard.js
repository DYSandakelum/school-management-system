import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './RoleDashboards.css';

function TeacherDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header teacher-header">
        <div className="header-left">
          <h1>🏫 School Management System</h1>
          <span className="role-badge teacher-badge">Teacher Portal</span>
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
          <h2>Welcome, {user.name}! 👨‍🏫</h2>
          <p>Manage your classes and students</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>My Classes</h3>
            <p>View and manage your assigned classes</p>
            <button className="card-btn teacher-btn">Manage Classes</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Assignments</h3>
            <p>Create and grade assignments</p>
            <button className="card-btn teacher-btn">Manage Assignments</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">✅</div>
            <h3>Attendance</h3>
            <p>Mark and manage student attendance</p>
            <button 
              className="card-btn teacher-btn"
              onClick={() => navigate('/teacher/attendance')}
            >
              Take Attendance
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Grade Students</h3>
            <p>Enter exam marks and grades</p>
            <button className="card-btn teacher-btn">Enter Grades</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Lesson Materials</h3>
            <p>Upload notes and study materials</p>
            <button className="card-btn teacher-btn">Upload Materials</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📢</div>
            <h3>Announcements</h3>
            <p>Send messages to students</p>
            <button className="card-btn teacher-btn">Create Announcement</button>
          </div>
        </div>

        <div className="info-section">
          <h3>👨‍🏫 Teacher Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Teacher ID:</span>
              <span className="info-value">{user.teacherId || 'N/A'}</span>
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

export default TeacherDashboard;
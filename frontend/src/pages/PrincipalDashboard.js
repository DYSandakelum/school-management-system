import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './RoleDashboards.css';

function PrincipalDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header principal-header">
        <div className="header-left">
          <h1>🏫 School Management System</h1>
          <span className="role-badge principal-badge">Principal Portal</span>
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
          <h2>Welcome, Principal {user.name}! 🎓</h2>
          <p>School administration and management</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Manage Teachers</h3>
            <p>View and manage teaching staff</p>
            <button className="card-btn principal-btn">View Teachers</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👨‍🎓</div>
            <h3>Manage Students</h3>
            <p>View and manage student records</p>
            <button className="card-btn principal-btn">View Students</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Academic Reports</h3>
            <p>View school performance analytics</p>
            <button className="card-btn principal-btn">View Reports</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Timetable Management</h3>
            <p>Create and manage school timetable</p>
            <button className="card-btn principal-btn">Manage Timetable</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Attendance Overview</h3>
            <p>Monitor student and teacher attendance</p>
            <button className="card-btn principal-btn">View Attendance</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📢</div>
            <h3>School Announcements</h3>
            <p>Send school-wide announcements</p>
            <button className="card-btn principal-btn">Create Announcement</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🏛️</div>
            <h3>Infrastructure</h3>
            <p>Manage classrooms and resources</p>
            <button className="card-btn principal-btn">Manage Resources</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>System Settings</h3>
            <p>Configure school system settings</p>
            <button className="card-btn principal-btn">Settings</button>
          </div>
        </div>

        <div className="info-section">
          <h3>🎓 Principal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">NIC:</span>
              <span className="info-value">{user.nic || 'N/A'}</span>
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

export default PrincipalDashboard;
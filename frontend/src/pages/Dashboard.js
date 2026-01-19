import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🏫 School Management System</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user.name}! 👋</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Preferred Language:</strong> {user.preferredLanguage}</p>
          </div>
          <div className="success-message">
            ✅ You are successfully logged in!
          </div>
        </div>

        <div className="info-card">
          <h3>🎉 Authentication Complete!</h3>
          <p>Your login system is working perfectly.</p>
          <p>Next steps: We'll build role-specific dashboards for students, teachers, principals, and parents.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
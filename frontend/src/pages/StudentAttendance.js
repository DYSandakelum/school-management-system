import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentAttendance.css';

function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/attendance/my-attendance',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttendance(response.data.data);
      setStatistics(response.data.statistics);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load attendance');
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      present: { class: 'status-present', text: '✓ Present', icon: '✓' },
      absent: { class: 'status-absent', text: '✗ Absent', icon: '✗' },
      late: { class: 'status-late', text: '⚠ Late', icon: '⚠' },
      excused: { class: 'status-excused', text: '📝 Excused', icon: '📝' },
    };
    return badges[status] || badges.present;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard/student')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>📅 My Attendance</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {statistics && (
        <div className="stats-container">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{statistics.total}</h3>
              <p>Total Days</p>
            </div>
          </div>

          <div className="stat-card present">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <h3>{statistics.present}</h3>
              <p>Present</p>
            </div>
          </div>

          <div className="stat-card absent">
            <div className="stat-icon">✗</div>
            <div className="stat-content">
              <h3>{statistics.absent}</h3>
              <p>Absent</p>
            </div>
          </div>

          <div className="stat-card late">
            <div className="stat-icon">⚠</div>
            <div className="stat-content">
              <h3>{statistics.late}</h3>
              <p>Late</p>
            </div>
          </div>

          <div className="stat-card percentage">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>{statistics.percentage}%</h3>
              <p>Attendance Rate</p>
            </div>
          </div>
        </div>
      )}

      <div className="attendance-list">
        <h2>Attendance History</h2>
        
        {attendance.length === 0 ? (
          <div className="no-data">
            <p>No attendance records found</p>
          </div>
        ) : (
          <div className="attendance-table">
            {attendance.map((record) => {
              const badge = getStatusBadge(record.status);
              return (
                <div key={record._id} className="attendance-row">
                  <div className="date-column">
                    <span className="date-day">
                      {new Date(record.date).getDate()}
                    </span>
                    <span className="date-month">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </span>
                  </div>
                  
                  <div className="details-column">
                    <p className="class-name">{record.class}</p>
                    <p className="period">Period: {record.period || 'Full Day'}</p>
                    {record.notes && (
                      <p className="notes">Note: {record.notes}</p>
                    )}
                  </div>
                  
                  <div className="status-column">
                    <span className={`status-badge ${badge.class}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentAttendance;
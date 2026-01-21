import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TeacherAttendance.css';

function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [period, setPeriod] = useState('morning');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Predefined classes (you can later fetch from backend)
  const classes = [
    'Grade 6-A', 'Grade 6-B',
    'Grade 7-A', 'Grade 7-B',
    'Grade 8-A', 'Grade 8-B',
    'Grade 9-A', 'Grade 9-B',
    'Grade 10-A', 'Grade 10-B',
    'Grade 11-A', 'Grade 11-B',
  ];

  const periods = [
    { value: 'morning', label: 'Morning Session' },
    { value: 'afternoon', label: 'Afternoon Session' },
    { value: 'full-day', label: 'Full Day' },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      fetchExistingAttendance();
    }
  }, [selectedDate, selectedClass, period, students]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/attendance/students',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(response.data.data);
      
      // Initialize attendance data with 'present' as default
      const initialAttendance = {};
      response.data.data.forEach((student) => {
        initialAttendance[student._id] = {
          status: 'present',
          notes: '',
        };
      });
      setAttendanceData(initialAttendance);
      setLoading(false);
    } catch (error) {
      setError('Failed to load students');
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/attendance/class/${selectedClass}/${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update attendance data with existing records
      const existingAttendance = {};
      response.data.data.forEach((record) => {
        if (record.period === period) {
          existingAttendance[record.student._id] = {
            status: record.status,
            notes: record.notes || '',
          };
        }
      });

      // Merge with current data
      setAttendanceData((prev) => ({
        ...prev,
        ...existingAttendance,
      }));
    } catch (error) {
      // No existing attendance, that's okay
      console.log('No existing attendance for this date/class/period');
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
  };

  const markAllAs = (status) => {
    const updatedData = {};
    students.forEach((student) => {
      updatedData[student._id] = {
        status,
        notes: attendanceData[student._id]?.notes || '',
      };
    });
    setAttendanceData(updatedData);
  };

  const saveAttendance = async () => {
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      
      // Save attendance for each student
      const promises = students.map((student) => {
        return axios.post(
          'http://localhost:5000/api/attendance/mark',
          {
            studentId: student._id,
            class: selectedClass,
            date: selectedDate,
            status: attendanceData[student._id].status,
            notes: attendanceData[student._id].notes,
            period: period,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });

      await Promise.all(promises);

      setSuccessMessage(
        `Attendance saved successfully for ${students.length} students!`
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusCount = (status) => {
    return Object.values(attendanceData).filter((a) => a.status === status)
      .length;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="teacher-attendance-page">
      <div className="page-header">
        <button
          onClick={() => navigate('/dashboard/teacher')}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
        <h1>✅ Mark Attendance</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="attendance-controls">
        <div className="control-card">
          <div className="controls-grid">
            <div className="control-group">
              <label>📅 Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="control-group">
              <label>🏫 Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>⏰ Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                {periods.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bulk-actions">
            <h4>Quick Actions:</h4>
            <div className="action-buttons">
              <button
                onClick={() => markAllAs('present')}
                className="bulk-btn present-btn"
              >
                ✓ Mark All Present
              </button>
              <button
                onClick={() => markAllAs('absent')}
                className="bulk-btn absent-btn"
              >
                ✗ Mark All Absent
              </button>
            </div>
          </div>
        </div>

        <div className="stats-summary">
          <div className="stat-item present">
            <span className="stat-number">{getStatusCount('present')}</span>
            <span className="stat-label">Present</span>
          </div>
          <div className="stat-item absent">
            <span className="stat-number">{getStatusCount('absent')}</span>
            <span className="stat-label">Absent</span>
          </div>
          <div className="stat-item late">
            <span className="stat-number">{getStatusCount('late')}</span>
            <span className="stat-label">Late</span>
          </div>
          <div className="stat-item excused">
            <span className="stat-number">{getStatusCount('excused')}</span>
            <span className="stat-label">Excused</span>
          </div>
        </div>
      </div>

      <div className="students-list">
        <div className="list-header">
          <h2>
            Students in {selectedClass} - {students.length} total
          </h2>
        </div>

        {students.length === 0 ? (
          <div className="no-data">
            <p>No students found</p>
          </div>
        ) : (
          <div className="students-grid">
            {students.map((student, index) => (
              <div key={student._id} className="student-card">
                <div className="student-info">
                  <div className="student-number">{index + 1}</div>
                  <div className="student-details">
                    <h3>{student.name}</h3>
                    <p className="student-admission">
                      {student.admissionNo || 'N/A'}
                    </p>
                    <p className="student-email">{student.email}</p>
                  </div>
                </div>

                <div className="attendance-controls-student">
                  <div className="status-buttons">
                    <button
                      className={`status-btn present ${
                        attendanceData[student._id]?.status === 'present'
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => handleStatusChange(student._id, 'present')}
                    >
                      ✓ Present
                    </button>
                    <button
                      className={`status-btn absent ${
                        attendanceData[student._id]?.status === 'absent'
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => handleStatusChange(student._id, 'absent')}
                    >
                      ✗ Absent
                    </button>
                    <button
                      className={`status-btn late ${
                        attendanceData[student._id]?.status === 'late'
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => handleStatusChange(student._id, 'late')}
                    >
                      ⚠ Late
                    </button>
                    <button
                      className={`status-btn excused ${
                        attendanceData[student._id]?.status === 'excused'
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => handleStatusChange(student._id, 'excused')}
                    >
                      📝 Excused
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Add notes (optional)"
                    value={attendanceData[student._id]?.notes || ''}
                    onChange={(e) =>
                      handleNotesChange(student._id, e.target.value)
                    }
                    className="notes-input"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="save-section">
        <button
          onClick={saveAttendance}
          disabled={saving}
          className="save-btn"
        >
          {saving ? 'Saving...' : '💾 Save Attendance'}
        </button>
      </div>
    </div>
  );
}

export default TeacherAttendance;
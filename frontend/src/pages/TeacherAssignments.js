import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TeacherAssignments.css';

function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: 'Grade 10-A',
    dueDate: '',
    totalMarks: 100,
    instructions: '',
  });

  const classes = [
    'Grade 6-A', 'Grade 6-B',
    'Grade 7-A', 'Grade 7-B',
    'Grade 8-A', 'Grade 8-B',
    'Grade 9-A', 'Grade 9-B',
    'Grade 10-A', 'Grade 10-B',
    'Grade 11-A', 'Grade 11-B',
  ];

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'Sinhala',
    'Tamil',
    'History',
    'Geography',
    'ICT',
  ];

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/assignments/teacher',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignments(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load assignments');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/assignments',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Assignment created successfully!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        subject: '',
        class: 'Grade 10-A',
        dueDate: '',
        totalMarks: 100,
        instructions: '',
      });
      fetchAssignments();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create assignment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/assignments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage('Assignment deleted successfully!');
      fetchAssignments();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to delete assignment');
    }
  };

  const viewSubmissions = (assignmentId) => {
    navigate(`/teacher/assignments/${assignmentId}/submissions`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="teacher-assignments-page">
      <div className="page-header">
        <button
          onClick={() => navigate('/dashboard/teacher')}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
        <div className="header-content">
          <h1>📝 My Assignments</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-btn"
          >
            {showCreateForm ? '✕ Cancel' : '+ Create New Assignment'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {showCreateForm && (
        <div className="create-form-container">
          <h2>Create New Assignment</h2>
          <form onSubmit={handleSubmit} className="assignment-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Math Homework - Chapter 5"
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Class *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Describe the assignment..."
              />
            </div>

            <div className="form-group">
              <label>Instructions (Optional)</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any special instructions..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Create Assignment
            </button>
          </form>
        </div>
      )}

      <div className="assignments-list">
        <h2>
          All Assignments ({assignments.length})
        </h2>

        {assignments.length === 0 ? (
          <div className="no-data">
            <p>No assignments created yet</p>
            <p>Click "Create New Assignment" to get started!</p>
          </div>
        ) : (
          <div className="assignments-grid">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                <div className="card-header">
                  <div>
                    <h3>{assignment.title}</h3>
                    <div className="card-meta">
                      <span className="subject-badge">{assignment.subject}</span>
                      <span className="class-badge">{assignment.class}</span>
                    </div>
                  </div>
                  {isOverdue(assignment.dueDate) && (
                    <span className="overdue-badge">Overdue</span>
                  )}
                </div>

                <p className="description">{assignment.description}</p>

                <div className="card-info">
                  <div className="info-item">
                    <span className="label">Due Date:</span>
                    <span className="value">
                      {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Total Marks:</span>
                    <span className="value">{assignment.totalMarks}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Submissions:</span>
                    <span className="value highlight">
                      {assignment.submissionCount || 0}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => viewSubmissions(assignment._id)}
                    className="action-btn view-btn"
                  >
                    View Submissions
                  </button>
                  <button
                    onClick={() => handleDelete(assignment._id)}
                    className="action-btn delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherAssignments;
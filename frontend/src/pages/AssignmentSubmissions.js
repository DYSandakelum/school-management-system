import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './AssignmentSubmissions.css';

function AssignmentSubmissions() {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignmentAndSubmissions();
  }, [assignmentId]);

  const fetchAssignmentAndSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch assignment details
      const assignmentResponse = await axios.get(
        `http://localhost:5000/api/assignments/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignment(assignmentResponse.data.data);

      // Fetch submissions
      const submissionsResponse = await axios.get(
        `http://localhost:5000/api/assignments/${assignmentId}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmissions(submissionsResponse.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || '');
    setFeedback(submission.feedback || '');
    setShowGradeModal(true);
  };

  const closeGradeModal = () => {
    setShowGradeModal(false);
    setSelectedSubmission(null);
    setGrade('');
    setFeedback('');
    setError('');
  };

  const handleGradeSubmission = async () => {
    if (!grade || grade < 0 || grade > assignment.totalMarks) {
      setError(`Grade must be between 0 and ${assignment.totalMarks}`);
      return;
    }

    setGrading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/assignments/submissions/${selectedSubmission._id}/grade`,
        { grade: Number(grade), feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Submission graded successfully!');
      closeGradeModal();
      fetchAssignmentAndSubmissions();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (submission) => {
    if (submission.status === 'graded') {
      return { class: 'status-graded', text: '✓ Graded' };
    }
    if (submission.status === 'late') {
      return { class: 'status-late', text: '⚠ Late Submission' };
    }
    return { class: 'status-pending', text: '📝 Pending Review' };
  };

  const calculateStats = () => {
    const total = submissions.length;
    const graded = submissions.filter((s) => s.status === 'graded').length;
    const pending = submissions.filter((s) => s.status === 'submitted').length;
    const late = submissions.filter((s) => s.status === 'late').length;

    const avgGrade =
      graded > 0
        ? (
            submissions
              .filter((s) => s.grade !== undefined)
              .reduce((sum, s) => sum + s.grade, 0) / graded
          ).toFixed(2)
        : 0;

    return { total, graded, pending, late, avgGrade };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading submissions...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="error-container">
        <p>Assignment not found</p>
        <button onClick={() => navigate('/teacher/assignments')}>
          Back to Assignments
        </button>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="submissions-page">
      <div className="page-header">
        <button
          onClick={() => navigate('/teacher/assignments')}
          className="back-btn"
        >
          ← Back to Assignments
        </button>
        <h1>📋 Assignment Submissions</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Assignment Info */}
      <div className="assignment-info-card">
        <h2>{assignment.title}</h2>
        <div className="assignment-details">
          <div className="detail">
            <span className="label">Subject:</span>
            <span className="value">{assignment.subject}</span>
          </div>
          <div className="detail">
            <span className="label">Class:</span>
            <span className="value">{assignment.class}</span>
          </div>
          <div className="detail">
            <span className="label">Due Date:</span>
            <span className="value">{formatDate(assignment.dueDate)}</span>
          </div>
          <div className="detail">
            <span className="label">Total Marks:</span>
            <span className="value">{assignment.totalMarks}</span>
          </div>
        </div>
        <p className="description">{assignment.description}</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
        </div>

        <div className="stat-card graded">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-number">{stats.graded}</div>
            <div className="stat-label">Graded</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-card late">
          <div className="stat-icon">⚠</div>
          <div className="stat-content">
            <div className="stat-number">{stats.late}</div>
            <div className="stat-label">Late Submissions</div>
          </div>
        </div>

        <div className="stat-card average">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-number">{stats.avgGrade}</div>
            <div className="stat-label">Average Grade</div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="submissions-container">
        <h2>Student Submissions ({submissions.length})</h2>

        {submissions.length === 0 ? (
          <div className="no-data">
            <p>No submissions yet</p>
          </div>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission) => {
              const badge = getStatusBadge(submission);
              return (
                <div key={submission._id} className="submission-card">
                  <div className="submission-header">
                    <div className="student-info">
                      <h3>{submission.student.name}</h3>
                      <p className="student-details">
                        {submission.student.admissionNo} • {submission.student.email}
                      </p>
                    </div>
                    <span className={`status-badge ${badge.class}`}>
                      {badge.text}
                    </span>
                  </div>

                  <div className="submission-meta">
                    <div className="meta-item">
                      <span className="label">Submitted:</span>
                      <span className="value">
                        {formatDate(submission.submittedAt)}
                      </span>
                    </div>
                    {submission.status === 'graded' && (
                      <>
                        <div className="meta-item">
                          <span className="label">Grade:</span>
                          <span className="value grade-value">
                            {submission.grade} / {assignment.totalMarks}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="label">Graded:</span>
                          <span className="value">
                            {formatDate(submission.gradedAt)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="submission-content">
                    <h4>Student's Answer:</h4>
                    <div className="content-box">
                      {submission.content}
                    </div>
                  </div>

                  {submission.feedback && (
                    <div className="feedback-display">
                      <h4>Your Feedback:</h4>
                      <p>{submission.feedback}</p>
                    </div>
                  )}

                  <button
                    onClick={() => openGradeModal(submission)}
                    className="grade-btn"
                  >
                    {submission.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {showGradeModal && (
        <div className="modal-overlay" onClick={closeGradeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Grade Submission</h2>
              <button onClick={closeGradeModal} className="close-btn">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="student-info-box">
                <h3>{selectedSubmission.student.name}</h3>
                <p>{selectedSubmission.student.email}</p>
              </div>

              <div className="submission-preview">
                <h4>Student's Answer:</h4>
                <div className="preview-content">
                  {selectedSubmission.content}
                </div>
              </div>

              <div className="grading-form">
                <div className="form-group">
                  <label>
                    Grade (out of {assignment.totalMarks}) *
                  </label>
                  <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    min="0"
                    max={assignment.totalMarks}
                    placeholder={`Enter grade (0-${assignment.totalMarks})`}
                  />
                </div>

                <div className="form-group">
                  <label>Feedback (Optional)</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="5"
                    placeholder="Provide feedback to the student..."
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="modal-footer">
              <button onClick={closeGradeModal} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleGradeSubmission}
                disabled={grading}
                className="submit-grade-btn"
              >
                {grading ? 'Saving...' : 'Save Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignmentSubmissions;
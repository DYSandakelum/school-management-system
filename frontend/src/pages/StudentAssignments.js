import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentAssignments.css';

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionContent, setSubmissionContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/assignments/student',
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

  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    
    // If already submitted, load existing content
    if (assignment.submission) {
      setSubmissionContent(assignment.submission.content);
    } else {
      setSubmissionContent('');
    }
    
    setShowSubmitModal(true);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setSelectedAssignment(null);
    setSubmissionContent('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!submissionContent.trim()) {
      setError('Please write your submission');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/assignments/${selectedAssignment._id}/submit`,
        { content: submissionContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Assignment submitted successfully!');
      closeSubmitModal();
      fetchAssignments();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
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

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (assignment) => {
    if (assignment.submission?.status === 'graded') {
      return {
        class: 'status-graded',
        text: `✓ Graded (${assignment.submission.grade}/${assignment.totalMarks})`,
      };
    }
    if (assignment.hasSubmitted) {
      return { class: 'status-submitted', text: '✓ Submitted' };
    }
    if (isOverdue(assignment.dueDate)) {
      return { class: 'status-overdue', text: '⚠ Overdue' };
    }
    const days = getDaysRemaining(assignment.dueDate);
    if (days <= 2) {
      return { class: 'status-urgent', text: `⏰ Due in ${days} day${days !== 1 ? 's' : ''}` };
    }
    return { class: 'status-pending', text: '📝 Pending' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading assignments...</p>
      </div>
    );
  }

  // Separate assignments into categories
  const pendingAssignments = assignments.filter(a => !a.hasSubmitted && !isOverdue(a.dueDate));
  const submittedAssignments = assignments.filter(a => a.hasSubmitted);
  const overdueAssignments = assignments.filter(a => !a.hasSubmitted && isOverdue(a.dueDate));

  return (
    <div className="student-assignments-page">
      <div className="page-header">
        <button
          onClick={() => navigate('/dashboard/student')}
          className="back-btn"
        >
          ← Back to Dashboard
        </button>
        <h1>📝 My Assignments</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-box pending">
          <div className="stat-number">{pendingAssignments.length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-box submitted">
          <div className="stat-number">{submittedAssignments.length}</div>
          <div className="stat-label">Submitted</div>
        </div>
        <div className="stat-box overdue">
          <div className="stat-number">{overdueAssignments.length}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-box total">
          <div className="stat-number">{assignments.length}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <div className="assignments-section">
          <h2>📋 Pending Assignments ({pendingAssignments.length})</h2>
          <div className="assignments-grid">
            {pendingAssignments.map((assignment) => {
              const badge = getStatusBadge(assignment);
              return (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  badge={badge}
                  onSubmit={openSubmitModal}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Overdue Assignments */}
      {overdueAssignments.length > 0 && (
        <div className="assignments-section">
          <h2>⚠️ Overdue Assignments ({overdueAssignments.length})</h2>
          <div className="assignments-grid">
            {overdueAssignments.map((assignment) => {
              const badge = getStatusBadge(assignment);
              return (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  badge={badge}
                  onSubmit={openSubmitModal}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Submitted Assignments */}
      {submittedAssignments.length > 0 && (
        <div className="assignments-section">
          <h2>✓ Submitted Assignments ({submittedAssignments.length})</h2>
          <div className="assignments-grid">
            {submittedAssignments.map((assignment) => {
              const badge = getStatusBadge(assignment);
              return (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  badge={badge}
                  onSubmit={openSubmitModal}
                  isSubmitted={true}
                />
              );
            })}
          </div>
        </div>
      )}

      {assignments.length === 0 && (
        <div className="no-data">
          <p>No assignments available</p>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={closeSubmitModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {selectedAssignment.hasSubmitted ? 'Resubmit' : 'Submit'} Assignment
              </h2>
              <button onClick={closeSubmitModal} className="close-btn">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="assignment-info">
                <h3>{selectedAssignment.title}</h3>
                <p className="assignment-meta">
                  <span>{selectedAssignment.subject}</span>
                  <span>•</span>
                  <span>{selectedAssignment.class}</span>
                  <span>•</span>
                  <span>Due: {formatDate(selectedAssignment.dueDate)}</span>
                </p>
                <p className="assignment-description">
                  {selectedAssignment.description}
                </p>
                {selectedAssignment.instructions && (
                  <div className="instructions-box">
                    <strong>Instructions:</strong>
                    <p>{selectedAssignment.instructions}</p>
                  </div>
                )}
              </div>

              {selectedAssignment.submission?.feedback && (
                <div className="feedback-box">
                  <h4>Teacher's Feedback:</h4>
                  <p>{selectedAssignment.submission.feedback}</p>
                  {selectedAssignment.submission.grade !== undefined && (
                    <p className="grade-display">
                      Grade: <strong>{selectedAssignment.submission.grade}</strong> / {selectedAssignment.totalMarks}
                    </p>
                  )}
                </div>
              )}

              <div className="submission-form">
                <label>Your Answer:</label>
                <textarea
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Write your answer here..."
                  rows="10"
                />
              </div>

              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="modal-footer">
              <button onClick={closeSubmitModal} className="cancel-btn">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="submit-btn"
              >
                {submitting ? 'Submitting...' : selectedAssignment.hasSubmitted ? 'Resubmit' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Assignment Card Component
function AssignmentCard({ assignment, badge, onSubmit, isSubmitted }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="assignment-card">
      <div className="card-header">
        <div className="card-title">
          <h3>{assignment.title}</h3>
          <div className="card-badges">
            <span className="subject-badge">{assignment.subject}</span>
            <span className={`status-badge ${badge.class}`}>{badge.text}</span>
          </div>
        </div>
      </div>

      <p className="card-description">{assignment.description}</p>

      <div className="card-details">
        <div className="detail-item">
          <span className="label">Class:</span>
          <span className="value">{assignment.class}</span>
        </div>
        <div className="detail-item">
          <span className="label">Due Date:</span>
          <span className="value">{formatDate(assignment.dueDate)}</span>
        </div>
        <div className="detail-item">
          <span className="label">Total Marks:</span>
          <span className="value">{assignment.totalMarks}</span>
        </div>
        {assignment.createdBy && (
          <div className="detail-item">
            <span className="label">Teacher:</span>
            <span className="value">{assignment.createdBy.name}</span>
          </div>
        )}
      </div>

      {isSubmitted && assignment.submission && (
        <div className="submission-info">
          <p>
            <strong>Submitted:</strong>{' '}
            {formatDate(assignment.submission.submittedAt)}
          </p>
          {assignment.submission.status === 'graded' && (
            <p className="grade-info">
              <strong>Grade:</strong> {assignment.submission.grade} / {assignment.totalMarks}
            </p>
          )}
        </div>
      )}

      <button
        onClick={() => onSubmit(assignment)}
        className="action-btn"
      >
        {isSubmitted ? 'View / Resubmit' : 'Submit Assignment'}
      </button>
    </div>
  );
}

export default StudentAssignments;
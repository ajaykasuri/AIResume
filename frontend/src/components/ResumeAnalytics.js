import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const ResumeAnalytics = () => {
  const [resumes, setResumes] = useState([]);
  const [templateStats, setTemplateStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchResumeData();
  }, [currentPage]);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [resumesRes, templatesRes] = await Promise.all([
        axios.get(`${API}/admin/resumes`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, limit: 10 }
        }),
        axios.get(`${API}/admin/analytics/templates`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setResumes(resumesRes.data.resumes);
      setTemplateStats(templatesRes.data.templateStats);
    } catch (error) {
      console.error('Error fetching resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 50) return 'orange';
    return 'red';
  };

  return (
    <div className="resume-analytics">
      <div className="section-header">
        <h2>Resume Analytics</h2>
        <button className="btn-primary" onClick={fetchResumeData}>
          🔄 Refresh
        </button>
      </div>

      {/* Template Usage Statistics */}
      <div className="analytics-section">
        <h3>Template Usage</h3>
        <div className="template-stats">
          {templateStats.map((template, index) => (
            <div key={index} className="template-stat-card">
              <div className="template-name">{template.template_name}</div>
              <div className="template-usage">
                <div className="usage-bar">
                  <div 
                    className="usage-fill"
                    style={{ width: `${template.usage_percentage}%` }}
                  ></div>
                </div>
                <div className="usage-numbers">
                  <span className="usage-count">{template.usage_count} resumes</span>
                  <span className="usage-percentage">{template.usage_percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Resumes Table */}
      <div className="analytics-section">
        <h3>Recent Resumes</h3>
        <div className="table-container">
          {loading ? (
            <div className="loading">Loading resumes...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Resume Name</th>
                  <th>User</th>
                  <th>Template</th>
                  <th>Completion</th>
                  <th>Fresher</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map(resume => (
                  <tr key={resume.resume_id}>
                    <td>{resume.resume_id}</td>
                    <td className="resume-name">{resume.resume_name}</td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar-sm">
                          {resume.user_name ? resume.user_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {resume.user_name}
                      </div>
                    </td>
                    <td>
                      <span className="template-badge">{resume.template_name}</span>
                    </td>
                    <td>
                      <div className="completion-indicator">
                        <div className={`completion-dot ${getCompletionColor(resume.completion_percentage)}`}></div>
                        <span>{resume.completion_percentage}%</span>
                      </div>
                    </td>
                    <td>
                      {resume.is_fresher ? (
                        <span className="badge badge-info">Yes</span>
                      ) : (
                        <span className="badge">No</span>
                      )}
                    </td>
                    <td>{new Date(resume.last_updated).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-sm btn-view" title="View Resume">
                          👁️
                        </button>
                        <button className="btn-sm btn-danger" title="Delete Resume">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalytics;
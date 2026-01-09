import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const DashboardOverview = ({ stats, onRefresh }) => {
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentResumes, setRecentResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentData();
  }, []);

  const fetchRecentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentUsers(response.data.recentUsers || []);
      setRecentResumes(response.data.recentResumes || []);
    } catch (error) {
      console.error('Error fetching recent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    onRefresh();
    fetchRecentData();
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <button className="btn-secondary" onClick={handleRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <div className="stat-number">{stats.totalUsers || 0}</div>
            <div className="stat-trend positive">+12% this week</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Resumes Created</h3>
            <div className="stat-number">{stats.totalResumes || 0}</div>
            <div className="stat-trend positive">+8% this week</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Active Today</h3>
            <div className="stat-number">{stats.activeToday || 0}</div>
            <div className="stat-trend">Currently online</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Popular Template</h3>
            <div className="stat-number">{stats.popularTemplate || 'Classic'}</div>
            <div className="stat-trend">45% usage</div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <div className="activity-section">
          <h3>Recent Users</h3>
          <div className="activity-list">
            {recentUsers.length > 0 ? recentUsers.map(user => (
              <div key={user.id} className="activity-item">
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="activity-details">
                  <div className="activity-title">{user.name || 'Unknown User'}</div>
                  <div className="activity-meta">{user.email}</div>
                </div>
                <div className="activity-time">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            )) : (
              <div className="no-data">No recent users</div>
            )}
          </div>
        </div>

        <div className="activity-section">
          <h3>Recent Resumes</h3>
          <div className="activity-list">
            {recentResumes.length > 0 ? recentResumes.map(resume => (
              <div key={resume.resume_id} className="activity-item">
                <div className="resume-icon">📄</div>
                <div className="activity-details">
                  <div className="activity-title">{resume.resume_name}</div>
                  <div className="activity-meta">
                    {resume.user_name} • {resume.template_name} Template
                  </div>
                </div>
                <div className="activity-time">
                  {new Date(resume.created_at).toLocaleDateString()}
                </div>
              </div>
            )) : (
              <div className="no-data">No recent resumes</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
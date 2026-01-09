import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

// Import Admin Components
import DashboardOverview from '../components/DashboardOverview';
import UserManagement from '../components/UserManagement';
import ResumeAnalytics from '../components/ResumeAnalytics';
import TemplateManagement from '../components/TemplateManagement';
import ContentLibrary from '../components/ContentLibrary';
import AdminSettings from '../components/AdminSettings';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response?.status === 401) {
        handleAutoLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Clear all storage items
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("editingResumeId");
    
    // Use hard redirect to avoid React state issues
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  const handleAutoLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const renderActiveTab = () => {
    const components = {
      dashboard: <DashboardOverview stats={stats} onRefresh={fetchDashboardData} />,
      users: <UserManagement />,
      resumes: <ResumeAnalytics />,
      templates: <TemplateManagement />,
      content: <ContentLibrary />,
      settings: <AdminSettings />
    };
    return components[activeTab] || components.dashboard;
  };

  if (isLoggingOut) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Logging out...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <button 
            className="btn-primary" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
          <button className="btn-primary" onClick={fetchDashboardData}>
            🔄 Refresh Data
          </button>
        </div>
      </div>

      <div className="admin-layout">
        <div className="admin-sidebar">
          <nav className="sidebar-nav">
            {[
              { key: 'dashboard', label: ' Dashboard', icon: '📊' },
              { key: 'users', label: 'User Management', icon: '👥' },
              { key: 'resumes', label: 'Resume Analytics', icon: '📄' },
              { key: 'templates', label: 'Template Management', icon: '🎨' },
              { key: 'content', label: 'Content Library', icon: '📝' },
              { key: 'settings', label: 'Settings', icon: '⚙️' },
            ].map((item) => (
              <button
                key={item.key}
                className={activeTab === item.key ? 'active' : ''}
                onClick={() => setActiveTab(item.key)}
                disabled={isLoggingOut}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-content">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
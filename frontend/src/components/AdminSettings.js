import React, { useState } from 'react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Resume Builder Pro',
    contactEmail: 'admin@resumebuilder.com',
    allowRegistrations: true,
    maintenanceMode: false,
    maxResumesPerUser: 10,
    defaultTemplate: 'Classic'
  });

  const [admins, setAdmins] = useState([
    { id: 1, name: 'John Doe', email: 'john@admin.com', role: 'super-admin', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@admin.com', role: 'content-manager', lastLogin: '2024-01-14' },
  ]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // In a real app, you would make an API call here
    alert('Settings saved successfully!');
  };

  const addAdmin = () => {
    const newAdmin = {
      id: admins.length + 1,
      name: 'New Admin',
      email: `admin${admins.length + 1}@resumebuilder.com`,
      role: 'content-manager',
      lastLogin: 'Never'
    };
    setAdmins([...admins, newAdmin]);
  };

  return (
    <div className="admin-settings">
      <div className="section-header">
        <h2>Admin Settings</h2>
        <button className="btn-primary" onClick={saveSettings}>
          💾 Save Settings
        </button>
      </div>

      <div className="settings-grid">
        {/* General Settings */}
        <div className="settings-card">
          <h3>General Settings</h3>
          <div className="setting-group">
            <label>Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
            />
          </div>
          <div className="setting-group">
            <label>Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
            />
          </div>
          <div className="setting-group">
            <label>Default Template</label>
            <select
              value={settings.defaultTemplate}
              onChange={(e) => handleSettingChange('defaultTemplate', e.target.value)}
            >
              <option value="Classic">Classic</option>
              <option value="Modern">Modern</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
        </div>

        {/* User Settings */}
        <div className="settings-card">
          <h3>User Settings</h3>
          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.allowRegistrations}
                onChange={(e) => handleSettingChange('allowRegistrations', e.target.checked)}
              />
              Allow new user registrations
            </label>
          </div>
          <div className="setting-group">
            <label>Maximum Resumes Per User</label>
            <input
              type="number"
              value={settings.maxResumesPerUser}
              onChange={(e) => handleSettingChange('maxResumesPerUser', parseInt(e.target.value))}
              min="1"
              max="50"
            />
          </div>
        </div>

        {/* System Settings */}
        <div className="settings-card">
          <h3>System Settings</h3>
          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              />
              Maintenance Mode
            </label>
            <small>When enabled, only admins can access the site</small>
          </div>
        </div>

        {/* Admin Users */}
        <div className="settings-card full-width">
          <div className="card-header">
            <h3>Admin Users</h3>
            <button className="btn-primary" onClick={addAdmin}>
              ➕ Add Admin
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar-sm">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      {admin.name}
                    </div>
                  </td>
                  <td>{admin.email}</td>
                  <td>
                    <select className="role-select" value={admin.role}>
                      <option value="super-admin">Super Admin</option>
                      <option value="content-manager">Content Manager</option>
                      <option value="support">Support</option>
                    </select>
                  </td>
                  <td>{admin.lastLogin}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-sm btn-warning">Reset Password</button>
                      <button className="btn-sm btn-danger">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
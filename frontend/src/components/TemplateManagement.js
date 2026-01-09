import React, { useState } from 'react';

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Classic', category: 'Professional', status: 'active', usage: 45 },
    { id: 2, name: 'Modern', category: 'Creative', status: 'active', usage: 30 },
    { id: 3, name: 'Executive', category: 'Professional', status: 'active', usage: 15 },
    { id: 4, name: 'Minimal', category: 'Clean', status: 'inactive', usage: 10 },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'Professional',
    status: 'active'
  });

  const toggleTemplateStatus = (templateId) => {
    setTemplates(templates.map(template => 
      template.id === templateId 
        ? { ...template, status: template.status === 'active' ? 'inactive' : 'active' }
        : template
    ));
  };

  const handleAddTemplate = (e) => {
    e.preventDefault();
    if (newTemplate.name.trim()) {
      const template = {
        id: templates.length + 1,
        name: newTemplate.name,
        category: newTemplate.category,
        status: newTemplate.status,
        usage: 0
      };
      setTemplates([...templates, template]);
      setNewTemplate({ name: '', category: 'Professional', status: 'active' });
    }
  };

  return (
    <div className="template-management">
      <div className="section-header">
        <h2>Template Management</h2>
        <button className="btn-primary">Add New Template</button>
      </div>

      {/* Add Template Form */}
      <div className="card">
        <h3>Add New Template</h3>
        <form onSubmit={handleAddTemplate} className="template-form">
          <div className="form-group">
            <label>Template Name</label>
            <input
              type="text"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              placeholder="Enter template name"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={newTemplate.category}
              onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
            >
              <option value="Professional">Professional</option>
              <option value="Creative">Creative</option>
              <option value="Clean">Clean</option>
              <option value="Modern">Modern</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={newTemplate.status}
              onChange={(e) => setNewTemplate({...newTemplate, status: e.target.value})}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Add Template</button>
        </form>
      </div>

      {/* Templates List */}
      <div className="card">
        <h3>Available Templates</h3>
        <div className="templates-grid">
          {templates.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-preview">
                <div className="template-placeholder">
                  {template.name}
                </div>
              </div>
              <div className="template-info">
                <h4>{template.name}</h4>
                <div className="template-meta">
                  <span className="category">{template.category}</span>
                  <span className={`status ${template.status}`}>
                    {template.status}
                  </span>
                </div>
                <div className="template-usage">
                  Usage: {template.usage}%
                </div>
                <div className="template-actions">
                  <button className="btn-sm btn-primary">Edit</button>
                  <button 
                    className={`btn-sm ${template.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => toggleTemplateStatus(template.id)}
                  >
                    {template.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="btn-sm btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateManagement;
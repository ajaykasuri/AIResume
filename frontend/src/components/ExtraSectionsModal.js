import React from "react";
import "../styles/modal.css"

export default function ExtraSectionsModal({ show, onClose, onAddExtra }) {
  if (!show) return null;

  const extraSections = [
    { name: "Achievements", icon: "🏆", description: "Showcase your accomplishments" },
    { name: "Certifications", icon: "📜", description: "Add professional certifications" },
    { name: "Awards", icon: "🎖️", description: "Highlight awards and recognition" },
    { name: "Languages", icon: "🌐", description: "List language proficiencies" },
    { name: "Interests", icon: "🎯", description: "Share hobbies and interests" },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>➕ Add Extra Section</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="mb-4" style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Choose what you'd like to add to your resume:
          </p>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {extraSections.map((item) => (
              <div
                key={item.name}
                className="extra-card"
                onClick={() => onAddExtra(item.name)}
                style={{
                  background: '#fff',
                  border: '1.5px solid #edeef2',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(39, 110, 241, 0.12)';
                  e.currentTarget.style.borderColor = '#276ef1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#edeef2';
                }}
              >
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {item.icon}
                </span>
                <span style={{ 
                  fontWeight: '600', 
                  color: '#2a3353',
                  fontSize: '1rem'
                }}>
                  {item.name}
                </span>
                <p style={{ 
                  color: '#64748b',
                  fontSize: '0.85rem',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            style={{ padding: '0.56rem 1.5rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
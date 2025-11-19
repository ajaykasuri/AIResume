import React from "react";

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
      <div className="modal-content elegant-modal">
        <div className="modal-header">
          <h2>➕ Add Extra Section</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">
            Choose what you'd like to add to your resume:
          </p>

          <div className="extra-section-grid">
            {extraSections.map((item) => (
              <div
                key={item.name}
                className="extra-card"
                onClick={() => onAddExtra(item.name)}
              >
                <span className="extra-icon">{item.icon}</span>
                <span className="extra-name">{item.name}</span>
                <p className="extra-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
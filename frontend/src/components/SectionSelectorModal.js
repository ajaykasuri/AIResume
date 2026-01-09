// Create a new component: components/SectionSelectorModal.js
import React, { useState } from "react";
import { FaTimes, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/SectionSelectorModal.css"

const SectionSelectorModal = ({ 
  show, 
  onClose, 
  selectedSections, 
  onUpdateSections,
  onApply 
}) => {
  const [tempSelections, setTempSelections] = useState(selectedSections);
  
  const sections = [
    { id: "basics", label: "Basic Information", required: true },
    { id: "skills", label: "Skills", required: true },
    { id: "experience", label: "Work Experience", required: true },
    { id: "projects", label: "Projects", required: false },
    { id: "personal", label: "Professional Summary", required: false },
    { id: "education", label: "Education", required: true },
    { id: "declaration", label: "Declaration", required: false },
    { id: "achievements", label: "Achievements", required: false },
    { id: "certifications", label: "Certifications", required: false },
    { id: "awards", label: "Awards", required: false },
    { id: "languages", label: "Languages", required: false },
    { id: "interests", label: "Interests", required: false },
  ];

  const toggleSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section && !section.required) {
      setTempSelections(prev => ({
        ...prev,
        [sectionId]: !prev[sectionId]
      }));
    }
  };

  const handleApply = () => {
    onUpdateSections(tempSelections);
    onApply();
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container section-selector-modal">
        <div className="modal-header">
          <h3>Select Sections to Include</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="section-selection-info">
            <p>Choose which sections to include in your resume. Required sections cannot be disabled.</p>
          </div>
          
          <div className="section-selection-grid">
            {sections.map((section) => (
              <div 
                key={section.id} 
                className={`section-selection-item ${section.required ? 'required' : ''} ${tempSelections[section.id] ? 'selected' : ''}`}
                onClick={() => !section.required && toggleSection(section.id)}
              >
                <div className="section-selection-icon">
                  {section.required ? (
                    <span className="required-badge">Required</span>
                  ) : tempSelections[section.id] ? (
                    <FaEye className="icon-active" />
                  ) : (
                    <FaEyeSlash className="icon-inactive" />
                  )}
                </div>
                <div className="section-selection-label">
                  <h4>{section.label}</h4>
                  <p>
                    {section.required 
                      ? "This section is required" 
                      : tempSelections[section.id] 
                        ? "Will be included in resume" 
                        : "Will not be included in resume"}
                  </p>
                </div>
                {!section.required && (
                  <div className="section-selection-toggle">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={tempSelections[section.id]}
                        onChange={() => toggleSection(section.id)}
                        disabled={section.required}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleApply}>
            <FaCheck /> Apply Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionSelectorModal;
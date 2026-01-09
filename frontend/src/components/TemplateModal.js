import React from "react";
import { FaTimes } from "react-icons/fa";
import "../styles/templateModal.css";
// Import template images
import classicImg from "../assets/classic.png";
import modernImg from "../assets/moderate.png";
import executiveImg from "../assets/executive.png";
import elegantImg from "../assets/elegant.png";

const templateOptions = [
  { id: 1, name: "Classic", img: classicImg },
  { id: 2, name: "Modern", img: modernImg },
  { id: 3, name: "Executive", img: executiveImg },
  { id: 4, name: "Elegant", img: elegantImg },
];

export default function TemplateModal({
  show,
  onClose,
  selectedTemplate,
  previewTemplate,
  onTemplateSelect,
  onApplyTemplate
}) {
  if (!show) return null;

  return (
    <div className="template-modal-overlay">
      <div className="template-modal-container">
        <div className="template-modal-header">
          <h2>🎨 Choose Template</h2>
          <button
            className="template-modal-close-btn"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="template-modal-content">
          <div className="template-main-content">
            <div className="template-selection-section">
              <p className="template-modal-subtitle">
                Select a template for your resume:
              </p>

              <div className="template-options-grid">
                {templateOptions.map((template) => (
                  <div
                    key={template.id}
                    className={`template-option-card ${
                      selectedTemplate === template.id ? "template-option-selected" : ""
                    }`}
                    onClick={() => onTemplateSelect(template.id)}
                  >
                    <div className="template-image-container">
                      <img
                        src={template.img}
                        alt={template.name}
                        className="template-thumbnail"
                      />
                    </div>
                    <div className="template-details">
                      <h4>{template.name}</h4>
                      <span className="template-selection-status">
                        {selectedTemplate === template.id
                          ? "Selected"
                          : "Select"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="template-preview-section">
              <div className="template-full-preview">
                <h3>Preview</h3>
                <div className="template-preview-container">
                  {previewTemplate ? (
                    <img
                      src={
                        templateOptions.find((t) => t.id === previewTemplate)?.img
                      }
                      alt={`${
                        templateOptions.find((t) => t.id === previewTemplate)?.name
                      } Preview`}
                      className="template-preview-image"
                    />
                  ) : (
                    <div className="no-preview">
                      <p>Select a template to preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="template-modal-footer">
          <button
            className="template-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="template-apply-btn"
            onClick={onApplyTemplate}
            disabled={!selectedTemplate}
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
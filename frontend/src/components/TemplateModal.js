import React from "react";
import { FaTimes } from "react-icons/fa";
import "../styles/builder.css"
// Import template images
import classicImg from "../assets/classic.png";
import modernImg from "../assets/moderate.png";
import executiveImg from "../assets/executive.png";
import elegantImg from "../assets/elegant.png";

const templates = [
  { id: 1, name: "Classic", img: classicImg },
  { id: 2, name: "Modern", img: modernImg },
  { id: 3, name: "Executive", img: executiveImg },
  { id: 4, name: "Elegant", img: elegantImg },
];
import Templates from "../pages/Templates";
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
    <div className="modal-overlay">
      <div className="modal-content template-modal">
        <div className="modal-header">
          <h2>🎨 Choose Template</h2>
          <button
            className="modal-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="template-modal-body">
          <div className="template-list-section">
            <p className="modal-subtitle">
              Select a template for your resume:
            </p>

            <div className="template-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`template-card ${
                    selectedTemplate === template.id ? "selected" : ""
                  }`}
                  onClick={() => onTemplateSelect(template.id)}
                >
                  <div className="template-preview">
                    <img
                      src={template.img}
                      alt={template.name}
                      className="template-image"
                    />
                  </div>
                  <div className="template-info">
                    <h4>{template.name}</h4>
                    <span className="template-status">
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
            <div className="full-preview">
              <h3>Preview</h3>
              {previewTemplate && (
                <div className="preview-image-container">
                  <img
                    src={
                      templates.find((t) => t.id === previewTemplate)?.img
                    }
                    alt={`${
                      templates.find((t) => t.id === previewTemplate)?.name
                    } Preview`}
                    className="full-preview-image"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="apply-btn"
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
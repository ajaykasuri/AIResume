import React, { useState } from "react";
import "../styles/templates.css";
import {
  FaSearchPlus,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import classicImg from "../assets/classic.png";
import modernImg from "../assets/moderate.png";
import executiveImg from "../assets/executive.png";
import elegantImg from "../assets/elegant.png";

const Templates = () => {
  const navigate = useNavigate();

  const templates = [
    { id: 1, name: "Classic", img: classicImg },
    { id: 2, name: "Modern", img: modernImg },
    { id: 3, name: "Executive", img: executiveImg },
    { id: 4, name: "Elegant", img: elegantImg },
  ];

  const [previewIndex, setPreviewIndex] = useState(null);

  const handleNext = (e) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev + 1) % templates.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };

  const handleNavigation = (templateId, templateName) => {
    navigate("/builder", { state: { templateId, templateName } });
  };

  return (
    <div className="templates-page">
      <h2 className="templates-title">Choose Your Resume Template</h2>
      <p className="templates-subtitle">
        Pick a design that suits your style — clean, modern, and ready to
        impress.
      </p>

      <div className="templates-grid">
        {templates.map((t, index) => (
          <div key={t.id} className="template-card">
            <div className="template-img-box">
              <img src={t.img} alt={t.name} className="template-image" />
              <button
                className="zoom-btn"
                onClick={() => setPreviewIndex(index)}
                aria-label="Preview Template"
              >
                <FaSearchPlus />
              </button>
            </div>
            <div className="template-info">
              <h3>{t.name}</h3>
              <button
                className="use-btn"
                onClick={() => handleNavigation(t.id, t.name)}
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Preview Modal */}
      {previewIndex !== null && (
        <div className="preview-overlay" onClick={() => setPreviewIndex(null)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setPreviewIndex(null)}>
              <FaTimes />
            </button>

            <button className="nav-btn left" onClick={handlePrev}>
              <FaChevronLeft />
            </button>

            <img
              src={templates[previewIndex].img}
              alt={`${templates[previewIndex].name} Preview`}
              className="preview-image"
            />

            <button className="nav-btn right" onClick={handleNext}>
              <FaChevronRight />
            </button>

            <p className="preview-caption">
              {templates[previewIndex].name} Template
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;

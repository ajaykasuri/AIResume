import React, { useState,useEffect } from "react";
import { toast } from "react-hot-toast";
import "../styles/ManageSectionsModal.css";

const ManageSectionsModal = ({
  currentSections,
  availableSections,
  onClose,
  onUpdate,
}) => {
  const [selectedSections, setSelectedSections] = useState([]);
   useEffect(() => {
    if (currentSections && Array.isArray(currentSections)) {
      // Remove duplicates using Set
      const uniqueSections = [...new Set(currentSections)];
      setSelectedSections(uniqueSections);
    }
  }, [currentSections]);
  const toggleSection = (sectionKey) => {
    setSelectedSections((prev) =>
      prev.includes(sectionKey)
        ? prev.filter((key) => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleSave = () => {
    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      return;
    }
    onUpdate(selectedSections);
  };

  return (
    <div className="manage-sections-modal-overlay" onClick={onClose}>
      <div
        className="manage-sections-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="manage-sections-modal-header">
          <h3>📝 Manage Resume Sections</h3>
          <button className="manage-sections-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="manage-sections-modal-body">
          <p className="manage-sections-description">
            Add or remove sections from your resume. Selected sections will
            appear in the builder.
          </p>

          <div className="manage-sections-counter">
            <strong>{selectedSections.length}</strong> of{" "}
            {availableSections.length} sections selected
          </div>

          <div className="manage-sections-list">
            {availableSections.map((section) => {
              const isSelected = selectedSections.includes(section.key);
              const isCore = [
                "personal_info",
                "profile",
                "experience",
                "education",
                "skills",
              ].includes(section.key);

              return (
                <div
                  key={section.key}
                  className={`manage-sections-item ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => toggleSection(section.key)}
                >
                  <div className="manage-sections-checkbox">
                    {isSelected && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="manage-sections-item-content">
                    <div className="manage-sections-item-header">
                      <strong className="manage-sections-item-title">
                        {section.name}
                      </strong>
                      {isCore && (
                        <span className="manage-sections-core-badge">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="manage-sections-modal-footer">
          <button
            className="manage-sections-btn manage-sections-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="manage-sections-btn manage-sections-btn-primary"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSectionsModal;

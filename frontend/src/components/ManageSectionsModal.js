import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "../styles/ManageSectionsModal.css"
const ManageSectionsModal = ({
  show,
  currentSections,
  availableSections,
  onClose,
  onUpdate,
}) => {
  const [selectedSections, setSelectedSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (show && currentSections && Array.isArray(currentSections)) {
      const uniqueSections = [...new Set(currentSections)];
      setSelectedSections(uniqueSections);
      setIsSaving(false);
    }
  }, [show, currentSections]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show && !isSaving) {
        onClose();
      }
    };
    
    if (show) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [show, isSaving, onClose]);

  const toggleSection = (sectionKey) => {
    if (isSaving) return;
    
    setSelectedSections((prev) =>
      prev.includes(sectionKey)
        ? prev.filter((key) => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleSave = async () => {
    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      return;
    }
    
    if (JSON.stringify(selectedSections) === JSON.stringify(currentSections)) {
      toast("No changes to save");
      onClose();
      return;
    }
    
    setIsSaving(true);
    try {
      await onUpdate(selectedSections);
      // Modal will be closed by parent component after successful update
    } catch (error) {
      console.error("Failed to update sections:", error);
      toast.error("Failed to update sections. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  // Don't render if not shown
  if (!show) return null;

  return (
    <div className="manage-sections-modal-overlay" onClick={handleClose}>
      <div
        className="manage-sections-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="manage-sections-modal-header">
          <h3>📝 Manage Resume Sections</h3>
          <button 
            className="manage-sections-modal-close" 
            onClick={handleClose}
            disabled={isSaving}
            aria-label="Close"
          >
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
                  } ${isSaving ? "disabled" : ""}`}
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
                    {section.stepId && (
                      <div className="manage-sections-item-step">
                        Step: {section.stepId}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="manage-sections-modal-footer">
          <button
            className="manage-sections-btn manage-sections-btn-secondary"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="manage-sections-btn manage-sections-btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="spinner"></span> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSectionsModal;
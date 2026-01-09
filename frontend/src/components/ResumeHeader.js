import React from "react";

export const ResumeHeader = ({
  resumeHook,
  setShowTemplateModal,
  setShowShareModal,
}) => {
  const {
    bulkSave,
    loading,
    handleDownload,
    isDownloading,
  } = resumeHook;

  return (
    <div className="resume-header">
      <div className="header-left">
        <h2>Resume Builder</h2>
      </div>

      <div className="header-actions">
        {/* Bulk Save */}
        <button
          onClick={bulkSave}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Saving..." : "Save Resume"}
        </button>

        {/* Download PDF */}
        <button
          onClick={() => handleDownload("pdf")}
          disabled={isDownloading}
          className="btn"
        >
          Download PDF
        </button>

        {/* Download Word */}
        <button
          onClick={() => handleDownload("docx")}
          disabled={isDownloading}
          className="btn"
        >
          Download Word
        </button>

        {/* Templates */}
        <button
          onClick={() => setShowTemplateModal(true)}
          className="btn"
        >
          Templates
        </button>

        {/* Share */}
        <button
          onClick={() => setShowShareModal(true)}
          className="btn"
        >
          Share
        </button>
      </div>
    </div>
  );
};

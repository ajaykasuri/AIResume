import React from "react";
import "../styles/ResumeHeader.css";
export const ResumeHeader = ({
  resumeHook,
  setShowTemplateModal,
  setShowShareModal,
  resumeDownloadRef,
}) => {
  const {
    bulkSave,
    loading,
    handleDownload,
    handleDownloadWord,
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

        <button
          onClick={() => handleDownload(resumeDownloadRef)}
          disabled={isDownloading}
          className="btn"
        >
          Download PDF
        </button>

        <button
          onClick={() => handleDownloadWord(resumeDownloadRef)}
          disabled={isDownloading}
          className="btn"
        >
          Download Word
        </button>

        <button onClick={() => setShowTemplateModal(true)} className="btn">
          Templates
        </button>

        {/* Share */}
        <button onClick={() => setShowShareModal(true)} className="btn">
          Share
        </button>
      </div>
    </div>
  );
};

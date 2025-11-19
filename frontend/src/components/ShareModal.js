import React from "react";
import { FaTimes, FaCopy, FaDownload, FaShareAlt } from "react-icons/fa";

export default function ShareModal({
  show,
  onClose,
  shareableUrl,
  onCopyUrl,
  onDownloadPdf,
  isDownloading
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content share-modal">
        <div className="modal-header">
          <h2>🔗 Share Your Resume</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="share-options">
          {/* URL Sharing */}
          <div className="share-option">
            <div className="share-option-header">
              <FaShareAlt className="share-icon" />
              <h3>Share via URL</h3>
            </div>
            <p className="share-description">
              Share this link with anyone to let them view your resume online
            </p>
            
            <div className="url-container">
              <input
                type="text"
                value={shareableUrl}
                readOnly
                className="url-input"
                placeholder="Generating URL..."
              />
              <button
                className="copy-btn"
                onClick={onCopyUrl}
                disabled={!shareableUrl}
              >
                <FaCopy /> Copy
              </button>
            </div>
          </div>

          {/* PDF Download */}
          <div className="share-option">
            <div className="share-option-header">
              <FaDownload className="share-icon" />
              <h3>Download PDF</h3>
            </div>
            <p className="share-description">
              Download a professional PDF version of your resume
            </p>
            
            <button
              className="download-pdf-btn"
              onClick={onDownloadPdf}
              disabled={isDownloading}
            >
              {isDownloading ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        <div className="share-tips">
          <h4>💡 Tips:</h4>
          <ul>
            <li>URL sharing allows others to view your resume without downloading</li>
            <li>PDF is best for printing or attaching to job applications</li>
            <li>Your resume data is securely stored and can be updated anytime</li>
          </ul>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
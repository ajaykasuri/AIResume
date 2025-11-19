import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ResumePreview from "../components/ResumePreview";
import "../styles/viewer.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function ResumeViewer() {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResume() {
      try {
        const { data } = await axios.get(`${API}/api/resumes/${resumeId}`);
        setResume(data);
      } catch (err) {
        setError("Resume not found or access denied");
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    }

    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  if (loading) {
    return (
      <div className="viewer-container">
        <div className="loading">Loading resume...</div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="viewer-container">
        <div className="error-message">
          <h2>Resume Not Found</h2>
          <p>{error || "The resume you're looking for doesn't exist."}</p>
          <a href="/" className="home-link">Create Your Own Resume</a>
        </div>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      <div className="viewer-header">
        <h1>{resume.data.basics.name}'s Resume</h1>
        <div className="viewer-actions">
          <button 
            onClick={() => window.print()} 
            className="print-btn"
          >
            Print Resume
          </button>
          <a href="/" className="create-btn">
            Create Your Resume
          </a>
        </div>
      </div>
      
      <div className="resume-preview-container">
        <ResumePreview resume={resume} />
      </div>
      
      <div className="viewer-footer">
        <p>Created with Resume Builder</p>
      </div>
    </div>
  );
}
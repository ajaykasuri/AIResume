import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaPlus,
  FaUserPlus,
  FaExclamationTriangle,
} from "react-icons/fa";
import "../styles/mycvs.css";
import CreateResumeModal from "../components/CreateResumeModal";
import { resumeAPI } from "../utils/api";

export default function MyCVs({ token, user, onGuestConversion }) {
  const [items, setItems] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const navigate = useNavigate();

  // Use props or fallback to localStorage
  const currentUser = user || JSON.parse(localStorage.getItem("user") || "{}");
  const isGuest = currentUser.isGuest || false;

  useEffect(() => {
    if (!token) return;

    resumeAPI
      .getUserResumes()
      .then((r) => {
        const updated = r.data.map((item) => ({
          ...item,
          progress: item.data?.completionPercentage || 0,
        }));

        setItems(updated);
      })
      .catch((err) => {
        console.error("Failed to fetch resumes", err);
      });
  }, [token]);

  const remove = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      const response = await resumeAPI.delete(id);
      setItems((prev) => prev.filter((i) => i.resume_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getProgressColor = (value) => {
    if (value <= 30) return "#f87171";
    if (value <= 60) return "#fbbf24";
    if (value <= 90) return "#60a5fa";
    return "#34d399";
  };

  const handleConvertToAccount = () => {
    navigate("/convert-guest");
  };

  return (
    <div className="mycvs-container">
      {/* Guest User Banner */}
      {isGuest && (
        <div className="guest-banner">
          <div className="guest-banner-content">
            <FaExclamationTriangle className="guest-icon" />
            <div className="guest-text">
              <strong>You're using ResumeBuilder as a guest</strong>
              <p>
                Your resumes will be saved for 30 days. Create an account to
                save them permanently.
              </p>
            </div>
            <button className="convert-btn" onClick={handleConvertToAccount}>
              <FaUserPlus style={{ marginRight: "8px" }} />
              Create Account
            </button>
          </div>
        </div>
      )}

      <div className="header-row">
        <div>
          <h2 className="title">My Resumes</h2>
          <p className="subtitle">
            {isGuest ? "Guest Session - " : ""}
            You have {items.length} resume{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          className="create-top-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus style={{ marginRight: "8px" }} />
          Create New
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaFileAlt size={48} />
          </div>
          <h3>No resumes yet</h3>
          <p>Create your first resume to get started</p>
          <button
            className="create-first-btn"
            onClick={
              () => setShowCreateModal(true)
              // navigate("/content")
            }
          >
            Create Your First Resume
          </button>
        </div>
      ) : (
        <div className="resumes-wrapper">
          <div className="create-card" onClick={() => setShowCreateModal(true)}>
            <div className="plus-icon">
              <FaPlus size={28} />
            </div>
            <h3>Create New Resume</h3>
            <p>Start building your career</p>
          </div>

          {items.map((i) => (
            <div key={i.resume_id} className="resume-box">
              <div className="resume-icon">
                <FaFileAlt size={26} />
              </div>

              <h3>{i.resume_name}</h3>
              <p>Your personalized resume</p>

              <div className="resume-tags">
                <button>Profile</button>
                <button>Work</button>
                <button>Skills</button>
                <button>Education</button>
              </div>

              <div className="resume-footer">
                <div className="resume-meta">
                  <p>
                    <strong>{i.title}</strong>
                  </p>
                  <small>
                    Created: {new Date(i.created_at).toLocaleDateString()} |
                    Updated: {new Date(i.last_updated).toLocaleDateString()}
                  </small>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-inner"
                    style={{
                      width: `${i.completion_percentage}%`,
                      background: getProgressColor(i.completion_percentage),
                    }}
                  ></div>
                </div>
                <div className="progress-text">
                  {Math.round(i.completion_percentage)}% Complete
                </div>
              </div>

              <div className="resume-actions">
                <button
                  className="edit-btn"
                  title="Edit Resume"
                  onClick={() => navigate(`/builder/${i.resume_id}`)}
                >
                  <FaEdit />
                </button>

                <button
                  className="delete-btn"
                  title="Delete Resume"
                  onClick={() => remove(i.resume_id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateResumeModal
          onClose={() => setShowCreateModal(false)}
          userId={currentUser.user_id || currentUser.id}
          token={token}
        />
      )}
      <button onClick={() => navigate("/sectionForm")}>section</button>
    </div>
  );
}

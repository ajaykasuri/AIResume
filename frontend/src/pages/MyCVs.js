import '../styles/mycvs.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaFileAlt, FaPlus } from "react-icons/fa";

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function MyCVs() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/api/resumes`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        console.log("✅ Resume API response:", r.data);

        // Use actual completionPercentage from backend
        const updatedData = r.data.map((item) => ({
          ...item,
          progress: item.data?.completionPercentage || 0, // fallback 0 if undefined
        }));

        console.log("🎯 Updated resumes with real progress:", updatedData);
        setItems(updatedData);
      })
      .catch((err) => {
        console.error("❌ Error fetching resumes:", err);
      });
  }, [token]);

  const remove = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await axios.delete(`${API}/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((i) => i.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const getProgressColor = (value) => {
    if (value <= 30) return '#f87171'; 
    if (value <= 60) return '#fbbf24'; 
    if (value <= 90) return '#60a5fa'; 
    return '#34d399'; 
  };

  return (
    <div className="mycvs-container">
      <div className="header-row">
        <div>
          <h2 className="title">My Resumes</h2>
          <p className="subtitle">
            You have {items.length} resume{items.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          className="create-top-btn"
          onClick={() => navigate('/builder')}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Create New
        </button>
      </div>

      <div className="resumes-wrapper">
        {/* Create New Resume Card */}
        <div className="create-card" onClick={() => navigate('/builder')}>
          <div className="plus-icon">
            <FaPlus size={28} />
          </div>
          <h3>Create New Resume</h3>
          <p>Start building your career</p>
        </div>

        {/* Resume Cards */}
        {items.map((i) => (
          <div key={i.id} className="resume-box">
            <div className="resume-icon">
              <FaFileAlt size={26} />
            </div>

            <h3>{i.title}</h3>
            <p>Your personalized resume</p>

            <div className="resume-tags">
              <button>Profile</button>
              <button>Work</button>
              <button>Skills</button>
              <button>Education</button>
            </div>

            <div className="resume-footer">
              <div className="resume-meta">
                <p><strong>{i.title}</strong></p>
                <small>
                  Created: {new Date(i.created_at).toLocaleDateString()} | Updated:{" "}
                  {new Date(i.updated_at).toLocaleDateString()}
                </small>
              </div>

              {/* ✅ Dynamic Progress bar */}
              <div className="progress-bar">
                <div
                  className="progress-inner"
                  style={{
                    width: `${i.progress}%`,
                    background: getProgressColor(i.progress),
                  }}
                ></div>
              </div>
              <div className="progress-text">
                {Math.round(i.progress)}% Complete
              </div>
            </div>

            <div className="resume-actions">
              <button
                className="edit-btn"
                title="Edit Resume"
                onClick={() => navigate(`/builder?editId=${i.id}`)}
              >
                <FaEdit />
              </button>
              <button
                className="delete-btn"
                title="Delete Resume"
                onClick={() => remove(i.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

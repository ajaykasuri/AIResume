import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function JobDetails() {
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Safely extract templateId
  const templateId = location.state?.templateId;

  // ✅ Optional: if no templateId found, redirect back once (avoiding infinite loop)
  useEffect(() => {
    if (!templateId) {
      navigate('/templates');
    }
  }, [templateId, navigate]);

  function handleContinue() {
    localStorage.setItem('jobRole', role);
    navigate('/builder', {
      state: {
        templateId,
        jobRole: role,
      },
    });
  }

  return (
    <div className="jobdetails center">
      <h2>Some Job Details...</h2>
      <p>This will enable our advanced AI technology to produce a tailor-made CV.</p>

      <label>What job are you applying for?</label>
      <input
        placeholder="e.g. Sales Manager"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <div className="actions">
        <button className="btn" onClick={() => navigate('/templates')}>
          Back
        </button>
        <button className="primary" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

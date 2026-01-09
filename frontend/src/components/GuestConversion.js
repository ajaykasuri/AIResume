import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/guest-conversion.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function GuestConversion({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const returnUrl = location.state?.returnUrl || "/mycvs";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Get guest data
      const guestUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      // Convert guest to regular account
      const response = await axios.post(
        `${API}/api/auth/convert-guest`,
        {
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          guestUserId: guestUser.user_id,
          guestResumes: guestUser.resumes || [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.token && response.data.user) {
        // Save new token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Call onLogin to update App state
        if (onLogin) {
          onLogin(response.data);
        }

        // Navigate to return URL
        navigate(returnUrl, { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Conversion failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    navigate(returnUrl);
  };

  return (
    <div className="guest-conversion-container">
      <div className="guest-conversion-banner">
        <h2>Upgrade Your Guest Account</h2>
        <p>Create a permanent account to save your resumes forever!</p>
      </div>

      <form onSubmit={handleSubmit} className="guest-conversion-form">
        {error && <div className="guest-conversion-error">{error}</div>}

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password (min. 6 characters)"
            required
          />
        </div>

        <div className="guest-conversion-actions">
          <button
            type="button"
            className="guest-conversion-secondary-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="guest-conversion-primary-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Permanent Account"}
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";
import { authAPI } from "../utils/api";


export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    // console.log("Submitting form:", form, "isRegister:", isRegister);
    try {
     const res = isRegister
        ? await authAPI.register(form)
        : await authAPI.login(form);
      onLogin(res.data);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  //  Updated: Real guest login handler
  async function continueAsGuest() {
    setIsLoading(true);
    try {
 const res = await authAPI.guest();
      onLogin(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start as guest");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="floating-shapes">
        <svg className="shape shape1" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#007bff20" />
        </svg>
        <svg className="shape shape2" viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" rx="20" fill="#00a2ff20" />
        </svg>
        <svg className="shape shape3" viewBox="0 0 100 100">
          <polygon points="50,5 95,97 5,97" fill="#6ba8ff25" />
        </svg>
      </div>

      <div className="auth-card">
        <h1 className="title">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="subtitle">
          {isRegister
            ? "Join ResumeAI to build your perfect CV effortlessly."
            : "Sign in to continue crafting your professional resume."}
        </p>

        <form onSubmit={submit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              disabled={isLoading}
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={isLoading}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            disabled={isLoading}
          />

          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div className="guest-section">
          <div className="divider">
            <span>Or</span>
          </div>

          <button
            className="guest-btn"
            onClick={continueAsGuest}
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Continue as Guest"}
          </button>

          <div className="guest-note">
            <small>
              Guest users can create resumes and download them. Create an
              account to save permanently.
            </small>
          </div>
        </div>

        <div className="switch">
          {isRegister ? "Already have an account?" : "New to ResumeAI?"}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            disabled={isLoading}
          >
            {isRegister ? " Sign In" : " Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

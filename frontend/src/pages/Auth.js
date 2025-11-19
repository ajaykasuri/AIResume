import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css"

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function submit(e) {
    e.preventDefault();
    try {
      const url = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await axios.post(API + url, form);
      onLogin(res.data);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Authentication failed");
    }
  }

  return (
    <div className="auth-container">
      {/* 🌈 Animated floating SVGs */}
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

      {/* 💫 Glass Card */}
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
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit">
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="switch">
          {isRegister ? "Already have an account?" : "New to ResumeAI?"}
          <button type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? " Sign In" : " Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

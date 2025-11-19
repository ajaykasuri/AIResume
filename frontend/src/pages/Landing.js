import React from "react";
import "../styles/Landing.css";

export default function Landing({ onCreate }) {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-logo">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="#007bff"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-3h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 11h10v2H7v-2zm6-4H7v2h6V7z" />
          </svg> */}
          <span className="nav-logo-text">
            <span className="ai-highlight"></span>
          </span>
        </div>
        <button className="build-btn" onClick={onCreate}>
          Build Resume
        </button>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1>Build a Professional Resume in Minutes</h1>
          <p>
            Let AI help you craft a job-winning resume. Fast, free, and
            beautifully designed to get you hired.
          </p>
          <button className="cta-btn" onClick={onCreate}>
            Create My Resume
          </button>
        </div>

        {/* Hero Illustration */}
        <div className="hero-illustration">
          <svg viewBox="0 0 600 400" className="resume-svg">
            <rect
              x="110"
              y="80"
              width="320"
              height="260"
              rx="18"
              fill="#fff"
              stroke="#d3e2ff"
              strokeWidth="3"
            />
            <rect
              x="140"
              y="110"
              width="260"
              height="22"
              rx="6"
              fill="#007bff"
              opacity="0.10"
            />
            <rect
              x="140"
              y="150"
              width="210"
              height="15"
              rx="4"
              fill="#007bff"
              opacity="0.18"
            />
            <rect
              x="140"
              y="175"
              width="250"
              height="15"
              rx="4"
              fill="#007bff"
              opacity="0.18"
            />
            <rect
              x="140"
              y="200"
              width="180"
              height="15"
              rx="4"
              fill="#007bff"
              opacity="0.15"
            />
            <rect
              x="140"
              y="245"
              width="240"
              height="70"
              rx="8"
              fill="#f3f6ff"
            />
            <rect
              x="150"
              y="260"
              width="180"
              height="12"
              rx="4"
              fill="#007bff"
              opacity="0.18"
            />
            <rect
              x="150"
              y="280"
              width="180"
              height="12"
              rx="4"
              fill="#007bff"
              opacity="0.14"
            />
            <rect
              x="150"
              y="300"
              width="180"
              height="12"
              rx="4"
              fill="#007bff"
              opacity="0.11"
            />
            <circle cx="470" cy="100" r="35" fill="#007bff" opacity="0.13" />
            <circle cx="510" cy="360" r="25" fill="#00a2ff" opacity="0.16" />
            <circle cx="90" cy="350" r="45" fill="#007bff" opacity="0.10" />
          </svg>
        </div>
      </main>

      {/* Features */}
      <section className="features-section">
        <div className="feature">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="AI powered"
          />
          <h3>AI Powered</h3>
          <p>
            Generate professional summaries and tailor your CV to any job
            instantly.
          </p>
        </div>
        <div className="feature">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
            alt="Templates"
          />
          <h3>Modern Templates</h3>
          <p>
            Choose sleek, ATS-friendly templates designed to make an impression.
          </p>
        </div>
        <div className="feature">
          <img
            src="https://cdn-icons-png.flaticon.com/512/679/679720.png"
            alt="Free icon"
          />
          <h3>Completely Free</h3>
          <p>
            No hidden fees. Build, download, and share your resume for free.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 CraftifyAI. Crafted with 💜 by Gsts.</p>
      </footer>
    </div>
  );
}

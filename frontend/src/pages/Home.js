import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home({ user }) {
  const navigate = useNavigate();
  return (
    <div className="home-outer-wrap">
      {/* Animated SVG Background Blobs */}
      <svg
        className="hero-bg-svg animated-blobs"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          className="bg-blob blob1"
          cx="500"
          cy="370"
          rx="540"
          ry="260"
        />
        <ellipse
          className="bg-blob blob2"
          cx="1200"
          cy="180"
          rx="170"
          ry="130"
        />
        <ellipse className="bg-blob blob3" cx="180" cy="60" rx="80" ry="60" />
      </svg>

      <div className="home-modern-content">
        <section className="hero-card glassy hero-animate">
          <h1>
            <span className="highlight-animate">
              Welcome!
              <br />
              Build your standout resume—fast.
            </span>
          </h1>
          <p>
            Showcase your career story with professional templates, smart
            suggestions, and easy export options.
          </p>
          {/* <div className="action-buttons">
            <button
              className="cta-btn btn-animate"
              onClick={() => navigate("/templates")}
            >
              Create New Resume
            </button>
            <button
              className="cta-outline btn-animate"
              onClick={() => navigate("/mycvs")}
            >
              View My Resumes
            </button>
          </div> */}
        </section>

        <section className="info-cards">
          <div className="feature-card glassy card-animate">
            <div className="feature-anim-icon">
              {/* Simple SVG icon, animate on hover */}
              <svg viewBox="0 0 48 48" width="32">
                <circle cx="24" cy="24" r="22" fill="#e7f5ff" />
                <rect
                  x="14"
                  y="16"
                  width="20"
                  height="16"
                  rx="3"
                  fill="#3b82f6"
                />
                <rect
                  x="17"
                  y="19"
                  width="14"
                  height="3"
                  rx="1"
                  fill="#fff"
                  opacity="0.8"
                />
              </svg>
            </div>
            <h3>Browse Templates</h3>
            <p>
              Select from a gallery of designer templates tailored to your
              goals.
            </p>
          </div>
          <div className="feature-card glassy card-animate">
            <div className="feature-anim-icon">
              {/* Simple SVG icon, animate on hover */}
              <svg viewBox="0 0 48 48" width="32">
                <circle cx="24" cy="24" r="22" fill="#e7f5ff" />
                <rect
                  x="14"
                  y="16"
                  width="20"
                  height="16"
                  rx="3"
                  fill="#3b82f6"
                />
                <rect
                  x="17"
                  y="19"
                  width="14"
                  height="3"
                  rx="1"
                  fill="#fff"
                  opacity="0.8"
                />
              </svg>
            </div>
            <h3>Simple Editing</h3>
            <p>
              Use our step-by-step builder and live preview to make changes
              instantly.
            </p>
          </div>
          <div className="feature-card glassy card-animate">
            <div className="feature-anim-icon">
              {/* Simple SVG icon, animate on hover */}
              <svg viewBox="0 0 48 48" width="32">
                <circle cx="24" cy="24" r="22" fill="#e7f5ff" />
                <rect
                  x="14"
                  y="16"
                  width="20"
                  height="16"
                  rx="3"
                  fill="#3b82f6"
                />
                <rect
                  x="17"
                  y="19"
                  width="14"
                  height="3"
                  rx="1"
                  fill="#fff"
                  opacity="0.8"
                />
              </svg>
            </div>
            <h3>One-Click Export</h3>
            <p>Download resumes as PDF or DOC, and share instantly.</p>
          </div>
          {/* ... repeat for other cards ... */}
        </section>

        <section className="testimonial-banner glassy testimonial-animate">
          <svg viewBox="0 0 48 48" width="32">
            <circle cx="24" cy="24" r="22" fill="#f0fdf4" />
            <path
              d="M14 30l8-8 8 8"
              stroke="#22c55e"
              strokeWidth="2"
              fill="none"
            />
            <rect
              x="18"
              y="18"
              width="12"
              height="3"
              rx="1.5"
              fill="#22c55e"
              opacity="0.8"
            />
          </svg>

          <span>
            “This tool helped me land interviews faster than ever. The design
            and flow are simply amazing!”
          </span>
        </section>
      </div>
    </div>
  );
}

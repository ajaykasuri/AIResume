import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const active = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <span className="logo-main">MyCVExpert</span>
          <span className="logo-sub">resume</span>
        </div>
        <nav className="nav-links">
          {/* <NavLink to="/home" className={active}>
            Home
          </NavLink> */}
          <NavLink to="/templates" className={active}>
            Templates
          </NavLink>
          <NavLink to="/mycvs" className={active}>
            My Resumes
          </NavLink>
        </nav>
      </div>

      <div className="navbar-right">
        <span className="user-greet">Hi, {user?.name || "Guest"}</span>
        <button
          className="logout-btn"
          onClick={() => {
            onLogout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

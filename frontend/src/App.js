import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Templates from "./pages/Templates";
import JobDetails from "./pages/JobDetails";
import Builder from "./pages/Builder";
import MyCVs from "./pages/MyCVs";
import "./styles/print.css";
import TestPrint from "./pages/TestPrint";
// import ResumeView from "./pages/ResumeView";
import Home from "./pages/Home";
import ResumeViewer from "./pages/ResumeViewr";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const handlePop = () => {
      if (
        localStorage.getItem("token") &&
        (window.location.pathname === "/login" ||
          window.location.pathname === "/")
      ) {
        navigate("/home", { replace: true });
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [navigate]);

  function handleLogin(authData) {
    if (authData.token) {
      localStorage.setItem("token", authData.token);
      setToken(authData.token);
    }
    if (authData.user) {
      localStorage.setItem("user", JSON.stringify(authData.user));
      setUser(authData.user);
    }
    navigate("/mycvs");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("editingResumeId");
    setToken(null);
    setUser(null);
    navigate("/login");
  }

  useEffect(() => {
    if (
      token &&
      (window.location.pathname === "/login" ||
        window.location.pathname === "/")
    ) {
      navigate("/mycvs", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div>
      {user && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          onCreate={() => navigate("/templates")}
          onMyCVs={() => navigate("/mycvs")}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<Landing onCreate={() => navigate("/templates")} />}
        />
        <Route path="/login" element={<Auth onLogin={handleLogin} />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <Templates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobdetails"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <Builder token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mycvs"
          element={
            <ProtectedRoute>
              <MyCVs token={token} />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/resume/:id/view"
          element={
            <ProtectedRoute>
              <ResumeView />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/testprint" element={<TestPrint />} />
        // Add this route
        <Route path="/view/:resumeId" element={<ResumeViewer />} />
      </Routes>
    </div>
  );
}

// Save login time
// localStorage.setItem("loginTime", Date.now());

// // Check on startup
// useEffect(() => {
//   const loginTime = localStorage.getItem("loginTime");
//   const hoursPassed = (Date.now() - loginTime) / (1000 * 60 * 60);

//   if (hoursPassed > 12) {
//     handleLogout();
//   }
// }, []);

import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import Home from "./pages/Home";
import ResumeViewer from "./pages/ResumeViewr";
import AdminDashboard from "./pages/AdminDashboard";
import UserDetails from "./components/UserDetails";
import GuestConversion from "./components/GuestConversion";
import "./pages/AiGeneration";
import AiGeneration from "./pages/AiGeneration";
import Manualresume from "./pages/Manualresume";
import content from "./pages/content";
import AIResumeFlow from "./pages/AIResumeFlow";
import AiBuilder from "./pages/AiBuilder";
import SectionForm from "./components/SectionForm";
import ResumeBuilder from "./pages/ResumeBuilder";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

function ProtectedRoute({ children }) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsValidating(false);
        return;
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.isGuest) {
        setIsAuthenticated(true);
        setIsValidating(false);
        return;
      }

      setIsAuthenticated(!!token);
      setIsValidating(false);
    };

    validateToken();
  }, []);

  if (isValidating) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.isGuest) {
    return <Navigate to="/mycvs" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to={user.role ? "/mycvs" : "/login"} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (token) {
    const location = useLocation();
    const isTryingToConvert =
      location.pathname === "/convert-guest" || location.pathname === "/login";

    if (user.isGuest && isTryingToConvert) {
      return children;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/mycvs" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.isGuest) {
    return <Navigate to="/mycvs" replace />;
  }

  return children;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  function handleLogin(authData) {
    if (authData.token) {
      localStorage.setItem("token", authData.token);
      setToken(authData.token);
    }
    if (authData.user) {
      localStorage.setItem("user", JSON.stringify(authData.user));
      setUser(authData.user);
    }

    const role = authData.user?.role;
    const isGuest = authData.user?.isGuest;

    console.log("Login - Role:", role, "IsGuest:", isGuest);

    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else if (isGuest) {
      navigate("/mycvs", { replace: true });
    } else {
      navigate("/mycvs", { replace: true });
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("editingResumeId");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  }

  const handleGuestConversion = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (token) {
      if (currentPath === "/login" || currentPath === "/") {
        if (user.role === "admin") {
          navigate("/admin", { replace: true });
        } else if (user.isGuest) {
          navigate("/templates", { replace: true });
        } else {
          navigate("/mycvs", { replace: true });
        }
      }
    }
  }, [token, navigate]);

  const showNavbar =
    user &&
    !location.pathname.startsWith("/admin") &&
    location.pathname !== "/login" &&
    location.pathname !== "/convert-guest";

  return (
    <div>
      {showNavbar && (
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
          element={
            <PublicRoute>
              <Landing onCreate={() => navigate("/templates")} />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Auth onLogin={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/content"
          element={
            <ProtectedRoute>
              <content />
            </ProtectedRoute>
          }
        />

        <Route
          path="/aiBuilder"
          element={
            <ProtectedRoute>
              <AiBuilder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/convert-guest"
          element={
            <PublicRoute>
              <GuestRoute>
                <GuestConversion onLogin={handleLogin} />
              </GuestRoute>
            </PublicRoute>
          }
        />

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
          path="/builder/:resume_id"
          element={
            <ProtectedRoute>
              <Builder token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume/ai"
          element={
            <ProtectedRoute>
              <AiGeneration token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mycvs"
          element={
            <ProtectedRoute>
              <MyCVs
                token={token}
                user={user}
                onGuestConversion={handleGuestConversion}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="ai-generator"
          element={
            <ProtectedRoute>
              <AiGeneration />
            </ProtectedRoute>
          }
        />
        <Route
          path="manual-creation"
          element={
            <ProtectedRoute>
              <Manualresume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <UserDetails />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route path="/testprint" element={<TestPrint />} />
        <Route path="/view/:resumeId" element={<ResumeViewer />} />

        <Route
          path="*"
          element={<Navigate to={token ? "/mycvs" : "/"} replace />}
        />

        <Route
          path="sectionForm"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </div>
  );
}

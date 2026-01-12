import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Sparkles,
  PenTool,
  Check,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Globe,
  Target,
  BookOpen,
  Award,
  FileText,
  Users,
  FileSignature,
  Award as AwardIcon,
  Book,
  UserCheck,
  ArrowRight,
  BriefcaseBusiness,
  Handshake,
  UserCircle,
} from "lucide-react";
import "../styles/CreateResumeModal.css";
import axios from "axios";
import { resumeAPI } from "../utils/api";

const CreateResumeModal = ({ onClose, userId, token }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState("manual");
  const [selectedSections, setSelectedSections] = useState([
    "profile",
    "experience",
    "education",
    "skills",
  ]);

  const [resumeData, setResumeData] = useState({
    resume_name: "",
    job_role: "",
    template_name: "modern",
    template_font: "Inter",
    template_id: 1,
  });
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      key: "personal_info",
      name: "Personal Information",
      description: "Basic contact details",
      icon: <UserCircle />,
      category: "basic",
    },
    {
      key: "profile",
      name: "Profile Summary",
      description: "Professional summary / Objective",
      icon: <User />,
      category: "basic",
    },
    {
      key: "experience",
      name: "Experience",
      description: "Work history",
      icon: <Briefcase />,
      category: "basic",
    },
    {
      key: "education",
      name: "Education",
      description: "Degrees & schools",
      icon: <GraduationCap />,
      category: "education",
    },
    {
      key: "skills",
      name: "Skills",
      description: "Technical & soft skills",
      icon: <Code />,
      category: "basic",
    },
    {
      key: "projects",
      name: "Projects",
      description: "Key projects",
      icon: <BookOpen />,
      category: "professional",
    },
    {
      key: "certifications",
      name: "Certifications",
      description: "Certificates & credentials",
      icon: <Award />,
      category: "professional",
    },
    {
      key: "awards",
      name: "Achievements & Awards",
      description: "Honors & recognitions",
      icon: <AwardIcon />,
      category: "professional",
    },
    {
      key: "publications",
      name: "Publications",
      description: "Research papers & journals",
      icon: <FileText />,
      category: "professional",
    },
    {
      key: "internships",
      name: "Internships",
      description: "Internship experience",
      icon: <BriefcaseBusiness />,
      category: "professional",
    },
    {
      key: "courses",
      name: "Courses",
      description: "Relevant coursework",
      icon: <Book />,
      category: "education",
    },
    {
      key: "languages",
      name: "Languages",
      description: "Language proficiency",
      icon: <Globe />,
      category: "additional",
    },
    {
      key: "interests",
      name: "Interests",
      description: "Hobbies & personal interests",
      icon: <Target />,
      category: "additional",
    },
    {
      key: "references",
      name: "References",
      description: "Professional references",
      icon: <Users />,
      category: "additional",
    },
    {
      key: "declarations",
      name: "Declarations",
      description: "Formal statements",
      icon: <FileSignature />,
      category: "additional",
    },
  ];

  const sectionCategories = {
    basic: {
      name: "Basic Sections",
      description: "Essential resume components",
    },
    education: { name: "Education", description: "Academic background" },
    professional: { name: "Professional", description: "Career achievements" },
    additional: { name: "Additional", description: "Optional sections" },
  };

  const toggleSection = (sectionKey) => {
    setSelectedSections((prev) =>
      prev.includes(sectionKey)
        ? prev.filter((key) => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const selectAllSections = () => {
    const allKeys = sections.map((s) => s.key);
    setSelectedSections(allKeys);
  };

  const selectRecommendedSections = () => {
    const recommended = [
      "personal_info",
      "profile",
      "education",
      "experience",
      "skills",
      "projects",
      "certifications",
    ];
    setSelectedSections(recommended);
  };

  const handleInputChange = (e) => {
    setResumeData({
      ...resumeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateResume = async () => {
    if (!resumeData.resume_name.trim()) {
      alert("Please enter a resume name");
      return;
    }

    setLoading(true);
    try {
      const data = {
        user_id: userId,
        resume_name: resumeData.resume_name,
        job_role: resumeData.job_role || "",
        selectedSections: selectedSections,
        template_name: "modern",
        template_font: "Inter",
        template_id: 1,
      };

      const response = await resumeAPI.create(data);

      if (response.data.resume_id) {
        const resumeId = response.data.resume_id;
        navigate(`/builder/${resumeId}`);
        onClose();
      }
    } catch (error) {
      console.error("Failed to create resume:", error);
      alert("Failed to create resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ProgressIndicator = () => {
    const stepsArr = [
      { number: 1, label: "Method", active: step === 1, completed: step > 1 },
      {
        number: 2,
        label: "Sections",
        active: step === 2,
        completed: step > 2,
      },
      {
        number: 3,
        label: "Details",
        active: step === 3,
        completed: step > 3,
      },
    ];

    return (
      <div className="create-resume-progress-bar">
        {stepsArr.map((stepItem, index) => (
          <React.Fragment key={stepItem.number}>
            <div className="create-resume-progress-step">
              <div
                className={`create-resume-step-circle ${
                  stepItem.active
                    ? "active"
                    : stepItem.completed
                    ? "completed"
                    : "inactive"
                }`}
              >
                {stepItem.completed ? <Check size={14} /> : stepItem.number}
              </div>
              <div
                className={`create-resume-step-label ${
                  stepItem.active ? "active" : ""
                }`}
              >
                {stepItem.label}
              </div>
            </div>
            {index < stepsArr.length - 1 && (
              <div
                className={`create-resume-step-connector ${
                  stepItem.completed ? "active" : ""
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // STEP 1
  if (step === 1) {
    return (
      <div className="create-resume-modal-overlay">
        <div className="create-resume-modal-container">
          <div className="create-resume-modal-header">
            <div>
              <h2 className="create-resume-modal-title">Create New Resume</h2>
              <p className="create-resume-modal-subtitle">
                Choose your preferred method
              </p>
            </div>
            <button
              onClick={onClose}
              className="create-resume-modal-close-button"
            >
              <X />
            </button>
          </div>

          <ProgressIndicator />

          <div className="create-resume-modal-content">
            <div className="create-resume-selection-options">
              <button
                onClick={() => setSelectedOption("manual")}
                className={`create-resume-option-button ${
                  selectedOption === "manual" ? "selected" : ""
                }`}
              >
                <div className="create-resume-option-content">
                  <div
                    className={`create-resume-option-icon ${
                      selectedOption === "manual" ? "selected" : "unselected"
                    }`}
                  >
                    <PenTool />
                  </div>
                  <div className="create-resume-option-text">
                    <h4>Manual Creation</h4>
                    <p>Start from scratch and customize everything</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedOption("ai")}
                className={`create-resume-option-button ${
                  selectedOption === "ai" ? "selected" : ""
                }`}
              >
                <div className="create-resume-option-content">
                  <div
                    className={`create-resume-option-icon ${
                      selectedOption === "ai" ? "selected" : "unselected"
                    }`}
                  >
                    <Sparkles />
                  </div>
                  <div className="create-resume-option-text">
                    <h4>AI Assistant</h4>
                    <p>Let AI suggest content based on your role</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="create-resume-modal-navigation">
              <div />
              <button
                onClick={() => {
                  if (selectedOption === "ai") {
                    navigate("/resume/ai");
                  } else {
                    setStep(2);
                  }
                }}
                className={`create-resume-next-button ${
                  selectedOption === "ai" ? "ai" : ""
                }`}
              >
                {selectedOption === "ai" ? (
                  <>
                    Continue with AI
                    <Sparkles size={16} />
                  </>
                ) : (
                  <>
                    Continue to Sections
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2
  if (step === 2) {
    const groupedSections = sections.reduce((acc, section) => {
      if (!acc[section.category]) {
        acc[section.category] = [];
      }
      acc[section.category].push(section);
      return acc;
    }, {});

    return (
      <div className="create-resume-modal-overlay">
        <div className="create-resume-modal-container-scrollable">
          <div className="create-resume-modal-header">
            <div>
              <h2 className="create-resume-modal-title">
                Select Resume Sections
              </h2>
              <p className="create-resume-modal-subtitle">
                Choose what to include in your resume
              </p>
            </div>
            <button
              onClick={onClose}
              className="create-resume-modal-close-button"
            >
              <X />
            </button>
          </div>

          <ProgressIndicator />

          <div className="create-resume-scrollable-content">
            <div className="create-resume-quick-selection-buttons">
              <button
                onClick={selectRecommendedSections}
                className="create-resume-quick-selection-button"
              >
                <UserCheck size={16} />
                <span>Recommended</span>
              </button>
              <button
                onClick={selectAllSections}
                className="create-resume-quick-selection-button"
              >
                <Check size={16} />
                <span>Select All</span>
              </button>
              <button
                onClick={() => setSelectedSections([])}
                className="create-resume-quick-selection-button"
              >
                <X size={16} />
                <span>Clear All</span>
              </button>
            </div>

            <div className="create-resume-sections-counter">
              <span>{selectedSections.length}</span> of {sections.length}{" "}
              sections selected
            </div>

            {Object.entries(groupedSections).map(
              ([category, categorySections]) => (
                <div key={category} className="create-resume-section-category">
                  <div className="create-resume-category-header">
                    <h3 className="create-resume-category-title">
                      {sectionCategories[category].name}
                    </h3>
                    <p className="create-resume-category-description">
                      {sectionCategories[category].description}
                    </p>
                  </div>
                  <div className="create-resume-sections-grid">
                    {categorySections.map((section) => (
                      <div
                        key={section.key}
                        className={`create-resume-section-card ${
                          selectedSections.includes(section.key)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => toggleSection(section.key)}
                      >
                        <div className="create-resume-section-icon">
                          {section.icon}
                        </div>
                        <div className="create-resume-section-checkbox">
                          {selectedSections.includes(section.key) && (
                            <div className="create-resume-section-checkbox-indicator" />
                          )}
                        </div>
                        <div className="create-resume-section-text">
                          <h4>{section.name}</h4>
                          <p>{section.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            <div className="create-resume-modal-navigation">
              <button
                onClick={() => setStep(1)}
                className="create-resume-back-button"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="create-resume-next-button"
              >
                Continue to Details
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3
  if (step === 3) {
    return (
      <div className="create-resume-modal-overlay">
        <div className="create-resume-modal-container">
          <div className="create-resume-modal-header">
            <div>
              <h2 className="create-resume-modal-title">Resume Details</h2>
              <p className="create-resume-modal-subtitle">
                Finalize your resume information
              </p>
            </div>
            <button
              onClick={onClose}
              className="create-resume-modal-close-button"
            >
              <X />
            </button>
          </div>

          <ProgressIndicator />

          <div className="create-resume-modal-content">
            <div className="create-resume-selected-sections-preview">
              <h4 className="create-resume-preview-title">
                Selected Sections:
              </h4>
              <div className="create-resume-selected-tags">
                {selectedSections.map((sectionKey) => {
                  const section = sections.find((s) => s.key === sectionKey);
                  return (
                    <span
                      key={sectionKey}
                      className="create-resume-selected-tag"
                    >
                      {section?.name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="create-resume-form-group">
              <label className="create-resume-form-label required">
                Resume Name
              </label>
              <input
                type="text"
                name="resume_name"
                value={resumeData.resume_name}
                onChange={handleInputChange}
                required
                className="create-resume-form-input"
                placeholder="e.g., Software Engineer Resume"
              />
            </div>

            <div className="create-resume-form-group">
              <label className="create-resume-form-label">
                Job Role (Optional)
              </label>
              <input
                type="text"
                name="job_role"
                value={resumeData.job_role}
                onChange={handleInputChange}
                className="create-resume-form-input"
                placeholder="e.g., Senior Software Engineer"
              />
              <p className="create-resume-form-hint">
                Helps AI suggest better content if you choose AI method
              </p>
            </div>

            <div className="create-resume-modal-navigation">
              <button
                onClick={() => setStep(2)}
                className="create-resume-back-button"
              >
                Back
              </button>
              <button
                onClick={handleCreateResume}
                disabled={loading || !resumeData.resume_name.trim()}
                className="create-resume-create-button"
              >
                {loading ? (
                  <>
                    <span className="create-resume-loading-icon">⏳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Resume &amp; Choose Template
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CreateResumeModal;

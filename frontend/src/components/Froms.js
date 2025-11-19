import React from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Proficiency levels for languages
const proficiencyLevels = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Basic",
  "Beginner",
];

// Basics Form
export function BasicsForm({ resume, updateBasics }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Basic Information</h2>
        <p className="step-description">
          Tell us about yourself - this will appear at the top of your resume
        </p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            value={resume.data.basics.name}
            onChange={(e) => updateBasics("name", e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            value={resume.data.basics.jobTitle}
            onChange={(e) => updateBasics("jobTitle", e.target.value)}
            placeholder="Software Engineer"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={resume.data.basics.email}
            onChange={(e) => updateBasics("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            value={resume.data.basics.phone}
            onChange={(e) => updateBasics("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={resume.data.basics.city}
            onChange={(e) => updateBasics("city", e.target.value)}
            placeholder="New York"
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={resume.data.basics.country}
            onChange={(e) => updateBasics("country", e.target.value)}
            placeholder="United States"
          />
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            value={resume.data.basics.linkedIn}
            onChange={(e) => updateBasics("linkedIn", e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="form-group">
          <label>GitHub</label>
          <input
            type="url"
            value={resume.data.basics.github}
            onChange={(e) => updateBasics("github", e.target.value)}
            placeholder="https://github.com/username"
          />
        </div>

        <div className="form-group full-width">
          <label>Website</label>
          <input
            type="url"
            value={resume.data.basics.website}
            onChange={(e) => updateBasics("website", e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
    </div>
  );
}

// Skills Form
export function SkillsForm({ resume, addSkill, removeSkill }) {
  const [newSkill, setNewSkill] = React.useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddSkill();
    }
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Skills & Technologies</h2>
        <p className="step-description">
          Add your technical and professional skills
        </p>
      </div>

      <div className="skill-input-container">
        <div className="skill-input-wrapper">
          <input
            className="skill-input"
            placeholder="Add a skill (e.g., JavaScript, React, Project Management)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={handleAddSkill}>
            Add Skill
          </button>
        </div>
      </div>

      <div className="skill-chips">
        {resume.data.skills.map((skill, index) => (
          <div key={index} className="chip">
            {skill}
            <button onClick={() => removeSkill(index)}>×</button>
          </div>
        ))}
      </div>

      {resume.data.skills.length === 0 && (
        <div className="empty-state">
          <p>No skills added yet. Add your first skill above.</p>
        </div>
      )}
    </div>
  );
}

// Experience Form Components
function ExperienceCard({ experience, onUpdate, onDelete }) {
  const handleDateChange = (field, date) => {
    onUpdate(experience.id, field, date ? date.toISOString().split("T")[0] : "");
  };

  return (
    <div className="experience-card">
      <div className="experience-header">
        <div className="experience-title">
          <h4>
            <input
              type="text"
              value={experience.title}
              onChange={(e) => onUpdate(experience.id, "title", e.target.value)}
              placeholder="Job Title"
              className="inline-input"
            />
          </h4>
          <div className="experience-company">
            <input
              type="text"
              value={experience.employer}
              onChange={(e) => onUpdate(experience.id, "employer", e.target.value)}
              placeholder="Company Name"
              className="inline-input"
            />
          </div>
        </div>
        <div className="experience-actions">
          <button
            className="btn-delete"
            onClick={() => onDelete(experience.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="experience-details">
        <div className="form-group">
          <label>From</label>
          <DatePicker
            selected={experience.from ? new Date(experience.from) : null}
            onChange={(date) => handleDateChange("from", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            placeholderText="Select start date"
            className="date-picker-input"
          />
        </div>
        <div className="form-group">
          <label>To</label>
          <DatePicker
            selected={experience.to ? new Date(experience.to) : null}
            onChange={(date) => handleDateChange("to", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            disabled={experience.current}
            placeholderText={experience.current ? "Present" : "Select end date"}
            className="date-picker-input"
          />
        </div>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={experience.current}
              onChange={(e) =>
                onUpdate(experience.id, "current", e.target.checked)
              }
            />
            <span className="checkmark"></span>
            Currently working here
          </label>
        </div>
      </div>

      <div className="form-group full-width">
        <label>Description</label>
        <textarea
          rows={3}
          value={experience.description}
          onChange={(e) => onUpdate(experience.id, "description", e.target.value)}
          placeholder="Describe your responsibilities and achievements..."
        />
      </div>
    </div>
  );
}

export function ExperienceForm({
  resume,
  isFresher,
  setIsFresher,
  addExperience,
  updateExperience,
  deleteExperience
}) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Work Experience</h2>
        <p className="step-description">
          List your professional work experience
        </p>
      </div>

      <div className="fresher-toggle">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isFresher}
            onChange={(e) => setIsFresher(e.target.checked)}
          />
          <span className="checkmark"></span>I am a Fresher (No Work Experience)
        </label>
      </div>

      {!isFresher && (
        <>
          <div className="experience-list">
            {resume.data.experience.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onUpdate={updateExperience}
                onDelete={deleteExperience}
              />
            ))}
          </div>

          <button className="add-entry-btn" onClick={addExperience}>
            <FaPlus /> Add Work Experience
          </button>

          {resume.data.experience.length === 0 && (
            <div className="empty-state">
              <p>
                No work experience added yet. Click the button above to add your first experience.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Projects Form Components
function ProjectCard({ project, onUpdate, onDelete, addProjectSkill, removeProjectSkill, handleGenerateProjectSummary }) {
  const [newSkill, setNewSkill] = React.useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addProjectSkill(project.id, newSkill.trim());
      setNewSkill("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddSkill();
    }
  };

  const handleDateChange = (field, date) => {
    onUpdate(project.id, field, date ? date.toISOString().split("T")[0] : "");
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-title">
          <h4>
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdate(project.id, "title", e.target.value)}
              placeholder="Project Title"
              className="inline-input"
            />
          </h4>
          <div className="project-link">
            <input
              type="url"
              value={project.link}
              onChange={(e) => onUpdate(project.id, "link", e.target.value)}
              placeholder="Project URL (optional)"
              className="inline-input"
            />
          </div>
        </div>
        <div className="project-actions">
          <button
            className="btn-delete"
            onClick={() => onDelete(project.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="project-dates">
        <div className="form-group">
          <label>From</label>
          <DatePicker
            selected={project.from ? new Date(project.from) : null}
            onChange={(date) => handleDateChange("from", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            placeholderText="Select start date"
            className="date-picker-input"
          />
        </div>
        
        <div className="form-group">
          <label>To</label>
          <DatePicker
            selected={project.to ? new Date(project.to) : null}
            onChange={(date) => handleDateChange("to", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            disabled={project.current}
            placeholderText={project.current ? "Present" : "Select end date"}
            className="date-picker-input"
          />
        </div>
        
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={project.current || false}
              onChange={(e) =>
                onUpdate(project.id, "current", e.target.checked)
              }
            />
            <span className="checkmark"></span>
            Currently working on this project
          </label>
        </div>
      </div>

      {/* Skills Used Section */}
      <div className="form-group full-width">
        <label>Skills & Technologies Used</label>
        <div className="skill-input-wrapper">
          <input
            className="skill-input"
            placeholder="Add a skill and press Enter"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={handleAddSkill}>
            Add
          </button>
        </div>

        <div className="skill-chips">
          {project.skillsUsed?.map((skill, index) => (
            <div key={index} className="chip">
              {skill}
              <button onClick={() => removeProjectSkill(project.id, index)}>×</button>
            </div>
          ))}
        </div>

        {(!project.skillsUsed || project.skillsUsed.length === 0) && (
          <div className="empty-state">
            <p>No skills added yet. Add skills used in this project.</p>
          </div>
        )}
      </div>

      <div className="optional-fields-toggle">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={project.showOptionalFields || false}
            onChange={(e) =>
              onUpdate(project.id, "showOptionalFields", e.target.checked)
            }
          />
          <span className="checkmark"></span>
          Add client & team details
        </label>
      </div>

      {project.showOptionalFields && (
        <div className="optional-fields">
          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              value={project.clientName || ""}
              onChange={(e) =>
                onUpdate(project.id, "clientName", e.target.value)
              }
              placeholder="Client or Company Name"
            />
          </div>
          
          <div className="form-group">
            <label>Team Size</label>
            <input
              type="number"
              value={project.teamSize || ""}
              onChange={(e) =>
                onUpdate(project.id, "teamSize", e.target.value)
              }
              placeholder="Number of team members"
              min="1"
            />
          </div>
        </div>
      )}

      <div className="form-group full-width">
        <label>Description</label>
        <textarea
          rows={3}
          value={project.description}
          onChange={(e) => onUpdate(project.id, "description", e.target.value)}
          placeholder="Describe the project, technologies used, your role, and achievements...then ai will take cares the rest"
        />
      </div>

      {/* AI Summary Generation for Project */}
      <div className="ai-summary-section">
        <button
          onClick={() => handleGenerateProjectSummary(project.id)}
          disabled={
            !project.title ||
            !project.skillsUsed ||
            project.skillsUsed.length === 0
          }
          className="ai-generate-btn"
        >
          🚀 Generate Project Summary with AI
        </button>
        <p className="ai-summary-hint">
          AI will generate a professional project description based on your project title and skills used
        </p>
      </div>
    </div>
  );
}

export function ProjectsForm({
  resume,
  addProject,
  updateProject,
  deleteProject,
  addProjectSkill,
  removeProjectSkill,
  handleGenerateProjectSummary
}) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Projects</h2>
        <p className="step-description">
          Showcase your personal or professional projects
        </p>
      </div>

      <div className="project-list">
        {resume.data.projects.map((proj) => (
          <ProjectCard
            key={proj.id}
            project={proj}
            onUpdate={updateProject}
            onDelete={deleteProject}
            addProjectSkill={addProjectSkill}
            removeProjectSkill={removeProjectSkill}
            handleGenerateProjectSummary={handleGenerateProjectSummary}
          />
        ))}
      </div>

      <button className="add-entry-btn" onClick={addProject}>
        <FaPlus /> Add Project
      </button>

      {resume.data.projects.length === 0 && (
        <div className="empty-state">
          <p>
            No projects added yet. Click the button above to add your first project.
          </p>
        </div>
      )}
    </div>
  );
}

// Summary Form
export function SummaryForm({
  resume,
  isFresher,
  updatePersonalStatement,
  handleGenerateSummary
}) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Professional Summary</h2>
        <p className="step-description">
          Write a brief overview of your professional background and career goals
        </p>
      </div>

      <div className="form-group full-width">
        <label>Summary</label>
        <textarea
          rows={6}
          placeholder="Experienced software engineer with 5+ years in web development..."
          value={resume.data.personalStatement}
          onChange={(e) => updatePersonalStatement(e.target.value)}
        />
      </div>

      <div className="ai-summary-section">
        <button
          onClick={handleGenerateSummary}
          disabled={
            !resume.data.basics.jobTitle ||
            resume.data.skills.length === 0
          }
          className="ai-generate-btn"
        >
          🚀 Generate with AI
        </button>
        <p className="ai-summary-hint">
          AI will generate a professional summary based on your job title,
          skills, experience, and projects
        </p>
      </div>
    </div>
  );
}

// Education Form Components
function EducationCard({ education, onUpdate, onDelete }) {
  const handleDateChange = (field, date) => {
    onUpdate(education.id, field, date ? date.toISOString().split("T")[0] : "");
  };

  return (
    <div className="education-card">
      <div className="education-header">
        <div className="education-title">
          <h4>
            <input
              type="text"
              value={education.degree}
              onChange={(e) => onUpdate(education.id, "degree", e.target.value)}
              placeholder="Degree or Certification"
              className="inline-input"
            />
          </h4>
          <div className="education-institution">
            <input
              type="text"
              value={education.institution}
              onChange={(e) => onUpdate(education.id, "institution", e.target.value)}
              placeholder="Institution Name"
              className="inline-input"
            />
          </div>
        </div>
        <div className="education-actions">
          <button
            className="btn-delete"
            onClick={() => onDelete(education.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="education-details">
        <div className="form-group">
          <label>From</label>
          <DatePicker
            selected={education.from ? new Date(education.from) : null}
            onChange={(date) => handleDateChange("from", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            placeholderText="Select start date"
            className="date-picker-input"
          />
        </div>
        <div className="form-group">
          <label>To</label>
          <DatePicker
            selected={education.to ? new Date(education.to) : null}
            onChange={(date) => handleDateChange("to", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            disabled={education.current}
            placeholderText={education.current ? "Present" : "Select end date"}
            className="date-picker-input"
          />
        </div>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={education.current}
              onChange={(e) =>
                onUpdate(education.id, "current", e.target.checked)
              }
            />
            <span className="checkmark"></span>
            Currently studying here
          </label>
        </div>
      </div>
    </div>
  );
}

export function EducationForm({
  resume,
  addEducation,
  updateEducation,
  deleteEducation
}) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Education</h2>
        <p className="step-description">
          Add your educational background
        </p>
      </div>

      <div className="education-list">
        {resume.data.education.map((edu) => (
          <EducationCard
            key={edu.id}
            education={edu}
            onUpdate={updateEducation}
            onDelete={deleteEducation}
          />
        ))}
      </div>

      <button className="add-entry-btn" onClick={addEducation}>
        <FaPlus /> Add Education
      </button>

      {resume.data.education.length === 0 && (
        <div className="empty-state">
          <p>
            No education entries added yet. Click the button above to add your first education.
          </p>
        </div>
      )}
    </div>
  );
}

// Extra Section Card Components
function AchievementCard({ achievement, onUpdate, onDelete }) {
  const handleDateChange = (field, date) => {
    onUpdate(achievement.id, field, date ? date.toISOString().split("T")[0] : "");
  };

  return (
    <div className="extra-section-card">
      <div className="extra-section-header">
        <h4>Achievement</h4>
        <button
          className="btn-delete"
          onClick={() => onDelete(achievement.id)}
        >
          <FaTrash />
        </button>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={achievement.title}
            onChange={(e) => onUpdate(achievement.id, "title", e.target.value)}
            placeholder="Employee of the Month"
          />
        </div>
        <div className="form-group">
          <label>Date *</label>
          <DatePicker
            selected={achievement.date ? new Date(achievement.date) : null}
            onChange={(date) => handleDateChange("date", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            placeholderText="Select date"
            className="date-picker-input"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            value={achievement.category}
            onChange={(e) => onUpdate(achievement.id, "category", e.target.value)}
            placeholder="Professional"
          />
        </div>
        <div className="form-group">
          <label>Issuer</label>
          <input
            type="text"
            value={achievement.issuer}
            onChange={(e) => onUpdate(achievement.id, "issuer", e.target.value)}
            placeholder="Company XYZ"
          />
        </div>
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            rows={2}
            value={achievement.description}
            onChange={(e) => onUpdate(achievement.id, "description", e.target.value)}
            placeholder="Recognized for increasing sales by 20% in Q2"
          />
        </div>
        <div className="form-group full-width">
          <label>Link</label>
          <input
            type="url"
            value={achievement.link}
            onChange={(e) => onUpdate(achievement.id, "link", e.target.value)}
            placeholder="https://example.com/certificate"
          />
        </div>
      </div>
    </div>
  );
}

function CertificationCard({ certification, onUpdate, onDelete }) {
  const handleDateChange = (field, date) => {
    onUpdate(certification.id, field, date ? date.toISOString().split("T")[0] : "");
  };

  return (
    <div className="extra-section-card">
      <div className="extra-section-header">
        <h4>Certification</h4>
        <button
          className="btn-delete"
          onClick={() => onDelete(certification.id)}
        >
          <FaTrash />
        </button>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={certification.name}
            onChange={(e) => onUpdate(certification.id, "name", e.target.value)}
            placeholder="AWS Certified Solutions Architect"
          />
        </div>
        <div className="form-group">
          <label>Issuer *</label>
          <input
            type="text"
            value={certification.issuer}
            onChange={(e) => onUpdate(certification.id, "issuer", e.target.value)}
            placeholder="Amazon Web Services"
          />
        </div>
        <div className="form-group">
          <label>Date Obtained *</label>
          <DatePicker
            selected={certification.dateObtained ? new Date(certification.dateObtained) : null}
            onChange={(date) => handleDateChange("dateObtained", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            placeholderText="Select date"
            className="date-picker-input"
          />
        </div>
        <div className="form-group">
          <label>Expiration Date</label>
          <DatePicker
            selected={certification.expirationDate ? new Date(certification.expirationDate) : null}
            onChange={(date) => handleDateChange("expirationDate", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            placeholderText="Select expiration date"
            className="date-picker-input"
          />
        </div>
        <div className="form-group">
          <label>Credential ID</label>
          <input
            type="text"
            value={certification.credentialId}
            onChange={(e) => onUpdate(certification.id, "credentialId", e.target.value)}
            placeholder="ABC123XYZ"
          />
        </div>
        <div className="form-group full-width">
          <label>Link</label>
          <input
            type="url"
            value={certification.link}
            onChange={(e) => onUpdate(certification.id, "link", e.target.value)}
            placeholder="https://www.aws.com/certificate"
          />
        </div>
      </div>
    </div>
  );
}

function AwardCard({ award, onUpdate, onDelete }) {
  const handleDateChange = (field, date) => {
    onUpdate(award.id, field, date ? date.toISOString().split("T")[0] : "");
  };

  return (
    <div className="extra-section-card">
      <div className="extra-section-header">
        <h4>Award</h4>
        <button
          className="btn-delete"
          onClick={() => onDelete(award.id)}
        >
          <FaTrash />
        </button>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={award.title}
            onChange={(e) => onUpdate(award.id, "title", e.target.value)}
            placeholder="Best Innovator Award"
          />
        </div>
        <div className="form-group">
          <label>Date *</label>
          <DatePicker
            selected={award.date ? new Date(award.date) : null}
            onChange={(date) => handleDateChange("date", date)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            placeholderText="Select date"
            className="date-picker-input"
          />
        </div>
        <div className="form-group">
          <label>Issuer</label>
          <input
            type="text"
            value={award.issuer}
            onChange={(e) => onUpdate(award.id, "issuer", e.target.value)}
            placeholder="Google Developer Group"
          />
        </div>
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            rows={2}
            value={award.description}
            onChange={(e) => onUpdate(award.id, "description", e.target.value)}
            placeholder="Awarded for innovative project ideas in hackathons"
          />
        </div>
        <div className="form-group full-width">
          <label>Link</label>
          <input
            type="url"
            value={award.link}
            onChange={(e) => onUpdate(award.id, "link", e.target.value)}
            placeholder="https://example.com/award"
          />
        </div>
      </div>
    </div>
  );
}

function LanguageCard({ language, onUpdate, onDelete }) {
  return (
    <div className="extra-section-card">
      <div className="extra-section-header">
        <h4>Language</h4>
        <button
          className="btn-delete"
          onClick={() => onDelete(language.id)}
        >
          <FaTrash />
        </button>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Language Name *</label>
          <input
            type="text"
            value={language.name}
            onChange={(e) => onUpdate(language.id, "name", e.target.value)}
            placeholder="Spanish"
          />
        </div>
        <div className="form-group">
          <label>Proficiency *</label>
          <select
            value={language.proficiency}
            onChange={(e) => onUpdate(language.id, "proficiency", e.target.value)}
          >
            <option value="">Select proficiency</option>
            {proficiencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Certificate</label>
          <input
            type="text"
            value={language.certificate}
            onChange={(e) => onUpdate(language.id, "certificate", e.target.value)}
            placeholder="DELE B2"
          />
        </div>
      </div>
    </div>
  );
}

function InterestCard({ interest, onUpdate, onDelete }) {
  return (
    <div className="extra-section-card">
      <div className="extra-section-header">
        <h4>Interest</h4>
        <button
          className="btn-delete"
          onClick={() => onDelete(interest.id)}
        >
          <FaTrash />
        </button>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={interest.name}
            onChange={(e) => onUpdate(interest.id, "name", e.target.value)}
            placeholder="Photography"
          />
        </div>
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            rows={2}
            value={interest.description}
            onChange={(e) => onUpdate(interest.id, "description", e.target.value)}
            placeholder="Landscape and portrait photography"
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to get item count for a section
function getSectionItemCount(data, sectionType) {
  switch (sectionType) {
    case "Achievements":
      return data.achievements.length;
    case "Certifications":
      return data.certifications.length;
    case "Awards":
      return data.awards.length;
    case "Languages":
      return data.languages.length;
    case "Interests":
      return data.interests.length;
    default:
      return 0;
  }
}

// Updated DeclarationForm with proper ordering and no duplicates
export function DeclarationForm({
  resume,
  updateDeclaration,
  visibleExtraSections,
  extraSections,
  setShowExtraModal,
  // Extra section handlers
  addAchievement,
  updateAchievement,
  deleteAchievement,
  addCertification,
  updateCertification,
  deleteCertification,
  addAward,
  updateAward,
  deleteAward,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  addInterest,
  updateInterest,
  deleteInterest,
  handleDeleteExtra,
  updateExtraContent
}) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Declaration & Additional Information</h2>
        <p className="step-description">
          Add a formal declaration and any additional sections to your resume
        </p>
      </div>

      <div className="form-group full-width">
        <label>Declaration Statement</label>
        <textarea
          rows={4}
          placeholder="I hereby declare that the information provided above is true to the best of my knowledge..."
          value={resume.data.declaration.description}
          onChange={(e) => updateDeclaration("description", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Your Name (Signature)</label>
        <input
          type="text"
          placeholder="Full Name"
          value={resume.data.declaration.signature}
          onChange={(e) => updateDeclaration("signature", e.target.value)}
        />
      </div>

      {/* Render sections in the EXACT order they were selected */}
      {visibleExtraSections.map((sectionType) => {
        // Only render if the section has items
        const hasItems = getSectionItemCount(resume.data, sectionType) > 0;
        
        if (!hasItems) return null;

        switch (sectionType) {
          case "Achievements":
            return (
              <div key="achievements" className="extra-sections">
                <h3>Achievements</h3>
                {resume.data.achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onUpdate={updateAchievement}
                    onDelete={deleteAchievement}
                  />
                ))}
                <button className="add-entry-btn" onClick={addAchievement}>
                  <FaPlus /> Add Achievement
                </button>
              </div>
            );

          case "Certifications":
            return (
              <div key="certifications" className="extra-sections">
                <h3>Certifications</h3>
                {resume.data.certifications.map((cert) => (
                  <CertificationCard
                    key={cert.id}
                    certification={cert}
                    onUpdate={updateCertification}
                    onDelete={deleteCertification}
                  />
                ))}
                <button className="add-entry-btn" onClick={addCertification}>
                  <FaPlus /> Add Certification
                </button>
              </div>
            );

          case "Awards":
            return (
              <div key="awards" className="extra-sections">
                <h3>Awards</h3>
                {resume.data.awards.map((award) => (
                  <AwardCard
                    key={award.id}
                    award={award}
                    onUpdate={updateAward}
                    onDelete={deleteAward}
                  />
                ))}
                <button className="add-entry-btn" onClick={addAward}>
                  <FaPlus /> Add Award
                </button>
              </div>
            );

          case "Languages":
            return (
              <div key="languages" className="extra-sections">
                <h3>Languages</h3>
                {resume.data.languages.map((language) => (
                  <LanguageCard
                    key={language.id}
                    language={language}
                    onUpdate={updateLanguage}
                    onDelete={deleteLanguage}
                  />
                ))}
                <button className="add-entry-btn" onClick={addLanguage}>
                  <FaPlus /> Add Language
                </button>
              </div>
            );

          case "Interests":
            return (
              <div key="interests" className="extra-sections">
                <h3>Interests & Hobbies</h3>
                {resume.data.interests.map((interest) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    onUpdate={updateInterest}
                    onDelete={deleteInterest}
                  />
                ))}
                <button className="add-entry-btn" onClick={addInterest}>
                  <FaPlus /> Add Interest
                </button>
              </div>
            );

          default:
            return null;
        }
      })}

      {/* Legacy Extra Sections */}
      {extraSections.map((sec) => (
        <div key={sec.id} className="extra-section-card">
          <div className="extra-section-header">
            <h4>{sec.type}</h4>
            <button
              className="btn-delete"
              onClick={() => handleDeleteExtra(sec.id)}
            >
              <FaTrash />
            </button>
          </div>
          <textarea
            className="extra-section-textarea"
            placeholder={`Enter details about your ${sec.type.toLowerCase()}...`}
            value={sec.content}
            onChange={(e) => updateExtraContent(sec.id, e.target.value)}
          />
        </div>
      ))}

      <button
        className="add-entry-btn"
        onClick={() => setShowExtraModal(true)}
      >
        <FaPlus /> Add Extra Section
      </button>
    </div>
  );
}
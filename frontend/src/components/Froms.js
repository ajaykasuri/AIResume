import React from "react";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";
import "../styles/forms.css";

const proficiencyLevels = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Basic",
  "Beginner",
];

// Country options for dropdown
const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Mexico",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Switzerland",
  "Singapore",
  "South Korea",
  "United Arab Emirates",
  "Other",
];

// ReactQuill modules configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
    ["code-block"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "code-block",
];

// Basics Form with country dropdown
export function BasicsForm({ resume, updateSection, validationErrors = {} }) {
  //  SAFE destructuring
  const basics = resume?.basics || {};
  console.log("Rendering BasicsForm with basics:", basics);
  const handleInputChange = (field, value) => {
    updateSection("basics", {
      ...basics,
      [field]: value,
    });
  };

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
            value={basics.full_name || ""}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            value={basics.job_title || ""}
            onChange={(e) => handleInputChange("job_title", e.target.value)}
            placeholder="Software Engineer"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={basics.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="john@example.com"
            className={validationErrors.email ? "input-error" : ""}
          />
          {validationErrors.email && (
            <span className="error-text">
              Please enter a valid email address
            </span>
          )}
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            value={basics.phone_number || ""}
            onChange={(e) => handleInputChange("phone_number", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={validationErrors.phone ? "input-error" : ""}
          />
          {validationErrors.phone && (
            <span className="error-text">
              Please enter a valid phone number
            </span>
          )}
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={basics.city || ""}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="New York"
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <select
            value={basics.country || ""}
            onChange={(e) => handleInputChange("country", e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            value={basics.linkedin_profile || ""}
            onChange={(e) =>
              handleInputChange("linkedin_profile", e.target.value)
            }
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="form-group">
          <label>GitHub</label>
          <input
            type="url"
            value={basics.github_profile || ""}
            onChange={(e) =>
              handleInputChange("github_profile", e.target.value)
            }
            placeholder="https://github.com/username"
          />
        </div>

        <div className="form-group full-width">
          <label>Website</label>
          <input
            type="url"
            value={basics.personal_website || ""}
            onChange={(e) =>
              handleInputChange("personal_website", e.target.value)
            }
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
    </div>
  );
}

export function SkillsForm({ resume, addSkill, removeSkill }) {
  const [newSkill, setNewSkill] = React.useState("");

  // ✅ SAFE ACCESS
  const skills = resume?.skills ?? [];

  console.log("Rendering SkillsForm with skills:", skills);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
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
            onKeyDown={handleKeyPress}
          />
          <button
            type="button"
            className="btn-add-compact"
            onClick={handleAddSkill}
          >
            Add
          </button>
        </div>
      </div>

      <div className="skill-chips">
        {skills.map((skill, index) => (
          <div key={index} className="chip">
            {skill}
            <button type="button" onClick={() => removeSkill(index)}>
              ×
            </button>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="empty-state">
          <p>No skills added yet. Add your first skill above.</p>
        </div>
      )}
    </div>
  );
}

function ExperienceCard({ experience, onUpdate, onDelete }) {
  const [isRichEditor, setIsRichEditor] = React.useState(false);

  const updateField = React.useCallback(
    (field, value) => {
      onUpdate(experience.id, field, value);
    },
    [experience.id, onUpdate]
  );

  const handleMonthYearChange = (date, field) => {
    if (!date) {
      updateField(field, "");
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    updateField(field, `${year}-${month}-01`);
  };

  const handleCurrentToggle = (checked) => {
    updateField("current", checked);
    if (checked) updateField("to", "");
  };

  return (
    <div className="experience-card">
      <div className="experience-header">
        <div className="experience-title">
          <input
            type="text"
            value={experience.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Job Title"
            className="inline-input"
          />

          <input
            type="text"
            value={experience.employer || ""}
            onChange={(e) => updateField("employer", e.target.value)}
            placeholder="Organization Name"
            className="inline-input"
          />
        </div>

        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(experience.id)}
        >
          <FaTrash />
        </button>
      </div>

      <div className="experience-dates">
        <DatePicker
          selected={experience.from ? new Date(experience.from) : null}
          onChange={(date) => handleMonthYearChange(date, "from")}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="MM/YYYY"
          className="date-picker-input"
        />

        <DatePicker
          selected={experience.to ? new Date(experience.to) : null}
          onChange={(date) => handleMonthYearChange(date, "to")}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          disabled={experience.current}
          placeholderText={experience.current ? "Present" : "MM/YYYY"}
          className="date-picker-input"
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={!!experience.current}
            onChange={(e) => handleCurrentToggle(e.target.checked)}
          />
          <span className="checkmark"></span>
          Currently working here
        </label>
      </div>

      <div className="form-group full-width">
        <div className="editor-header">
          <label>Description</label>
          <button
            type="button"
            className={`toggle-switch ${isRichEditor ? "on" : "off"}`}
            onClick={() => setIsRichEditor((v) => !v)}
          />
        </div>

        {isRichEditor ? (
          <ReactQuill
            value={experience.description || ""}
            onChange={(content) => updateField("description", content)}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
          />
        ) : (
          <textarea
            rows={3}
            value={experience.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe your responsibilities and achievements..."
          />
        )}
      </div>
    </div>
  );
}

export function ExperienceForm(
{deleteItem,
saveCurrentSection,
updateSection,
isFresher,setIsFresher,
addExperience,
resume}
) {

  
  const experienceList = resume?.experience ?? [];
  console.log("Rendering ExperienceForm with experienceList:", experienceList);

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Work Experience</h2>
        <p className="step-description">
          List your professional work experience
        </p>
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={isFresher}
          onChange={(e) => setIsFresher(e.target.checked)}
        />
        <span className="checkmark"></span>I am a Fresher (No Work Experience)
      </label>

      {!isFresher && (
        <>
          <div className="experience-list">
            {experienceList.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={experienceList}
                onUpdate={updateSection}
                onDelete={deleteItem}
              />
            ))}
          </div>

          <div className="btn-row">
            <button type="button" onClick={addExperience}>
              <FaPlus /> Add Experience
            </button>
          </div>

          {experienceList.length === 0 && (
            <div className="empty-state">
              <p>No experience added yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Updated Projects Form Components with FIXED date pickers
function ProjectCard({
  project,
  onUpdate,
  onDelete,
  addProjectSkill,
  removeProjectSkill,
  handleGenerateProjectSummary,
}) {
  const [newSkill, setNewSkill] = React.useState("");
  const [isRichEditor, setIsRichEditor] = React.useState(false);

  const updateField = React.useCallback(
    (field, value) => {
      onUpdate(project.id, field, value);
    },
    [project.id, onUpdate]
  );

  const handleMonthYearChange = (date, field) => {
    if (!date) {
      updateField(field, "");
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    updateField(field, `${year}-${month}-01`);
  };

  const handleCurrentToggle = (checked) => {
    updateField("current", checked);
    if (checked) updateField("to", "");
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addProjectSkill(project.id, newSkill.trim());
      setNewSkill("");
    }
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-title">
          <input
            type="text"
            value={project.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Project Title"
            className="inline-input"
          />

          <input
            type="url"
            value={project.link || ""}
            onChange={(e) => updateField("link", e.target.value)}
            placeholder="Project URL (optional)"
            className="inline-input"
          />
        </div>

        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(project.id)}
        >
          <FaTrash />
        </button>
      </div>

      <div className="project-dates">
        <DatePicker
          selected={project.from ? new Date(project.from) : null}
          onChange={(date) => handleMonthYearChange(date, "from")}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="MM/YYYY"
          className="date-picker-input"
        />

        <DatePicker
          selected={project.to ? new Date(project.to) : null}
          onChange={(date) => handleMonthYearChange(date, "to")}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          disabled={project.current}
          placeholderText={project.current ? "Present" : "MM/YYYY"}
          className="date-picker-input"
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={!!project.current}
            onChange={(e) => handleCurrentToggle(e.target.checked)}
          />
          <span className="checkmark"></span>
          Currently working on this project
        </label>
      </div>

      {/* Skills */}
      <div className="form-group full-width">
        <label>Skills & Technologies Used</label>

        <div className="skill-input-wrapper compact">
          <input
            className="skill-input"
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <button type="button" onClick={handleAddSkill}>
            Add
          </button>
        </div>

        <div className="skill-chips">
          {(project.skillsUsed ?? []).map((skill, index) => (
            <div key={index} className="chip">
              {skill}
              <button
                type="button"
                onClick={() => removeProjectSkill(project.id, index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {(project.skillsUsed?.length ?? 0) === 0 && (
          <div className="empty-state small">
            <p>No skills added yet.</p>
          </div>
        )}
      </div>

      {/* Optional Fields */}
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={!!project.showOptionalFields}
          onChange={(e) => updateField("showOptionalFields", e.target.checked)}
        />
        <span className="checkmark"></span>
        Add client & team details
      </label>

      {project.showOptionalFields && (
        <div className="optional-fields">
          <input
            type="text"
            value={project.clientName || ""}
            onChange={(e) => updateField("clientName", e.target.value)}
            placeholder="Client Name"
          />

          <input
            type="number"
            value={project.teamSize || ""}
            onChange={(e) => updateField("teamSize", e.target.value)}
            min="1"
            placeholder="Team Size"
          />
        </div>
      )}

      {/* Description */}
      <div className="form-group full-width">
        <div className="editor-header">
          <label>Description</label>
          <button
            type="button"
            className={`toggle-switch ${isRichEditor ? "on" : "off"}`}
            onClick={() => setIsRichEditor((v) => !v)}
          />
        </div>

        {isRichEditor ? (
          <ReactQuill
            value={project.description || ""}
            onChange={(content) => updateField("description", content)}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
          />
        ) : (
          <textarea
            rows={3}
            value={project.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe the project..."
          />
        )}
      </div>

      {/* AI Summary */}
      <button
        type="button"
        onClick={() => handleGenerateProjectSummary(project.id)}
        disabled={!project.title || !project.skillsUsed?.length}
        className="ai-generate-btn"
      >
        🚀 Generate Project Summary with AI
      </button>
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
  handleGenerateProjectSummary,
}) {
  const projects = resume?.projects ?? [];

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Projects</h2>
        <p className="step-description">
          Showcase your personal or professional projects
        </p>
      </div>

      <div className="project-list">
        {projects.map((proj) => (
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

      <div className="btn-row">
        <button type="button" onClick={addProject}>
          <FaPlus /> Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <p>No projects added yet.</p>
        </div>
      )}
    </div>
  );
}

// Summary Form with ReactQuill
export function SummaryForm({
  resume,
  updatePersonalStatement,
  handleGenerateSummary,
}) {
  const [isRichEditor, setIsRichEditor] = React.useState(false);

  const personalStatement = resume.personalStatement ?? "";

  const jobTitle = resume?.basics?.jobTitle ?? "";
  const skillsCount = resume?.skills?.length ?? 0;

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Professional Summary</h2>
        <p className="step-description">
          Write a brief overview of your professional background and career
          goals
        </p>
      </div>

      <div className="form-group full-width">
        <div className="editor-header">
          <label>Summary</label>
          <button
            type="button"
            className={`toggle-switch ${isRichEditor ? "on" : "off"}`}
            onClick={() => setIsRichEditor((v) => !v)}
          />
        </div>

        {isRichEditor ? (
          <ReactQuill
            value={personalStatement}
            onChange={updatePersonalStatement}
            modules={quillModules}
            formats={quillFormats}
            theme="snow"
            placeholder="Experienced software engineer with 5+ years..."
          />
        ) : (
          <textarea
            rows={6}
            value={personalStatement}
            onChange={(e) => updatePersonalStatement(e.target.value)}
            placeholder="Experienced software engineer with 5+ years..."
          />
        )}
      </div>

      <div className="ai-summary-section">
        <button
          type="button"
          onClick={handleGenerateSummary}
          disabled={!jobTitle || skillsCount === 0}
          className="ai-generate-btn"
        >
          🚀 Generate Summary with AI
        </button>

        <p className="ai-summary-hint">
          AI will generate a professional summary based on your profile
        </p>
      </div>
    </div>
  );
}

// Education Form Components with FIXED date pickers
function EducationCard({ education, onUpdate, onDelete }) {
  const updateField = (field, value) => {
    onUpdate(education.id, field, value);
  };

  const handleMonthYearChange = (date, field) => {
    if (!date) {
      updateField(field, "");
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    updateField(field, `${year}-${month}-01`);
  };

  const handleCurrentToggle = (checked) => {
    updateField("current", checked);
    if (checked) updateField("to", "");
  };

  return (
    <div className="education-card">
      <div className="education-header">
        <div className="education-title">
          <input
            type="text"
            value={education.degree || ""}
            onChange={(e) => updateField("degree", e.target.value)}
            placeholder="Degree or Certification"
            className="inline-input"
          />

          <input
            type="text"
            value={education.institution || ""}
            onChange={(e) => updateField("institution", e.target.value)}
            placeholder="Institution Name"
            className="inline-input"
          />
        </div>

        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(education.id)}
        >
          <FaTrash />
        </button>
      </div>

      <div className="education-dates">
        <DatePicker
          selected={education.from ? new Date(education.from) : null}
          onChange={(date) => handleMonthYearChange(date, "from")}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="MM/YYYY"
          className="date-picker-input"
        />

        <DatePicker
          selected={education.to ? new Date(education.to) : null}
          onChange={(date) => handleMonthYearChange(date, "to")}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          disabled={education.current}
          placeholderText={education.current ? "Present" : "MM/YYYY"}
          className="date-picker-input"
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={!!education.current}
            onChange={(e) => handleCurrentToggle(e.target.checked)}
          />
          <span className="checkmark"></span>
          Currently studying here
        </label>
      </div>
    </div>
  );
}

export function EducationForm({
  resume,
  addEducation,
  updateEducation,
  deleteEducation,
}) {
  const educationList = resume?.education ?? [];

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Education</h2>
        <p className="step-description">Add your educational background</p>
      </div>

      <div className="education-list">
        {educationList.map((edu) => (
          <EducationCard
            key={edu.id}
            education={edu}
            onUpdate={updateEducation}
            onDelete={deleteEducation}
          />
        ))}
      </div>

      <div className="btn-row">
        <button type="button" onClick={addEducation}>
          <FaPlus /> Add Education
        </button>
      </div>

      {educationList.length === 0 && (
        <div className="empty-state">
          <p>No education entries added yet.</p>
        </div>
      )}
    </div>
  );
}

// Extra Section Card Components with FIXED date pickers
function AchievementCard({ achievement, onUpdate, onDelete }) {
  const updateField = (field, value) => onUpdate(achievement.id, field, value);

  return (
    <div className="extra-section-card">
      <div className="extra-section-header">
        <h4>Achievement</h4>
        <button type="button" onClick={() => onDelete(achievement.id)}>
          <FaTrash />
        </button>
      </div>

      <div className="form-grid">
        <input
          type="text"
          value={achievement.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Achievement Title"
        />

        <DatePicker
          selected={achievement.date ? new Date(achievement.date) : null}
          onChange={(date) => updateField("date", toMonthYearISO(date))}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="MM/YYYY"
        />

        <input
          type="text"
          value={achievement.category || ""}
          onChange={(e) => updateField("category", e.target.value)}
          placeholder="Category"
        />

        <input
          type="text"
          value={achievement.issuer || ""}
          onChange={(e) => updateField("issuer", e.target.value)}
          placeholder="Issuer"
        />

        <textarea
          rows={2}
          value={achievement.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          maxLength={200}
          placeholder="Description"
        />

        <input
          type="url"
          value={achievement.link || ""}
          onChange={(e) => updateField("link", e.target.value)}
          placeholder="Optional link"
        />
      </div>
    </div>
  );
}

function CertificationCard({ certification, onUpdate, onDelete }) {
  const updateField = (field, value) =>
    onUpdate(certification.id, field, value);

  return (
    <div className="extra-section-card">
      <div className="extra-section-header">
        <h4>Certification</h4>
        <button type="button" onClick={() => onDelete(certification.id)}>
          <FaTrash />
        </button>
      </div>

      <div className="form-grid">
        <input
          type="text"
          value={certification.name || ""}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Certification Name"
        />

        <input
          type="text"
          value={certification.issuer || ""}
          onChange={(e) => updateField("issuer", e.target.value)}
          placeholder="Issuer"
        />

        <DatePicker
          selected={
            certification.dateObtained
              ? new Date(certification.dateObtained)
              : null
          }
          onChange={(date) => updateField("dateObtained", toMonthYearISO(date))}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="MM/YYYY"
        />

        <DatePicker
          selected={
            certification.expirationDate
              ? new Date(certification.expirationDate)
              : null
          }
          onChange={(date) =>
            updateField("expirationDate", toMonthYearISO(date))
          }
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="MM/YYYY"
        />

        <input
          type="text"
          value={certification.credentialId || ""}
          onChange={(e) => updateField("credentialId", e.target.value)}
          placeholder="Credential ID"
        />

        <input
          type="url"
          value={certification.link || ""}
          onChange={(e) => updateField("link", e.target.value)}
          placeholder="Certificate URL"
        />
      </div>
    </div>
  );
}

function AwardCard({ award, onUpdate, onDelete }) {
  const updateField = (field, value) => onUpdate(award.id, field, value);

  return (
    <div className="extra-section-card">
      <div className="extra-section-header">
        <h4>Award</h4>
        <button type="button" onClick={() => onDelete(award.id)}>
          <FaTrash />
        </button>
      </div>

      <div className="form-grid">
        <input
          type="text"
          value={award.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Award Title"
        />

        <DatePicker
          selected={award.date ? new Date(award.date) : null}
          onChange={(date) => updateField("date", toMonthYearISO(date))}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="MM/YYYY"
        />

        <input
          type="text"
          value={award.issuer || ""}
          onChange={(e) => updateField("issuer", e.target.value)}
          placeholder="Issuer"
        />

        <textarea
          rows={2}
          value={award.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          maxLength={200}
          placeholder="Description"
        />

        <input
          type="url"
          value={award.link || ""}
          onChange={(e) => updateField("link", e.target.value)}
          placeholder="Optional link"
        />
      </div>
    </div>
  );
}

function LanguageCard({ language, onUpdate, onDelete }) {
  return (
    <div className="extra-section-card">
      <div className="extra-section-header">
        <h4>Language</h4>
        <button className="btn-delete" onClick={() => onDelete(language.id)}>
          <FaTrash />
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Language Name *</label>
          <input
            type="text"
            value={language.name || ""}
            onChange={(e) => onUpdate(language.id, "name", e.target.value)}
            placeholder="Spanish"
          />
        </div>

        <div className="form-group">
          <label>Proficiency *</label>
          <select
            value={language.proficiency || ""}
            onChange={(e) =>
              onUpdate(language.id, "proficiency", e.target.value)
            }
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
            value={language.certificate || ""}
            onChange={(e) =>
              onUpdate(language.id, "certificate", e.target.value)
            }
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
        <button className="btn-delete" onClick={() => onDelete(interest.id)}>
          <FaTrash />
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={interest.name || ""}
            onChange={(e) => onUpdate(interest.id, "name", e.target.value)}
            placeholder="Photography"
          />
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            rows={2}
            value={interest.description || ""}
            onChange={(e) =>
              onUpdate(interest.id, "description", e.target.value)
            }
            placeholder="Landscape and portrait photography"
            maxLength={150}
          />
          <div className="char-count">
            {(interest.description || "").length}/150 characters
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get item count for a section
function getSectionItemCount(data = {}, sectionType) {
  switch (sectionType) {
    case "Achievements":
      return data.achievements?.length || 0;
    case "Certifications":
      return data.certifications?.length || 0;
    case "Awards":
      return data.awards?.length || 0;
    case "Languages":
      return data.languages?.length || 0;
    case "Interests":
      return data.interests?.length || 0;
    default:
      return 0;
  }
}

export function DeclarationForm({
  resume,
  updateDeclaration,

  visibleExtraSections = [],
  extraSections = [],

  setShowExtraModal,

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
  updateExtraContent,
  handleSaveExtraSection,
}) {
  const data = resume || {
    declaration: {},
    achievements: [],
    certifications: [],
    awards: [],
    languages: [],
    interests: [],
  };

  const declaration = data.declaration || {};
  const safeExtraSections = Array.isArray(extraSections) ? extraSections : [];

  const safeVisibleExtraSections = Array.isArray(visibleExtraSections)
    ? visibleExtraSections
    : [];

  const handleSaveExtra = async (sectionType) => {
    if (handleSaveExtraSection) {
      await handleSaveExtraSection(sectionType);
    }
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Declaration & Additional Information</h2>
        <p className="step-description">
          Add a formal declaration and additional resume sections
        </p>
      </div>

      <div className="form-group full-width">
        <label>Declaration Statement</label>
        <textarea
          rows={4}
          placeholder="I hereby declare that the information provided above is true..."
          value={declaration.description || ""}
          onChange={(e) => updateDeclaration("description", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Your Name (Signature)</label>
        <input
          type="text"
          placeholder="Full Name"
          value={declaration.signature || ""}
          onChange={(e) => updateDeclaration("signature", e.target.value)}
        />
      </div>

      {safeVisibleExtraSections.map((sectionType) => {
        const hasItems = getSectionItemCount(data, sectionType) > 0;
        if (!hasItems) return null;

        switch (sectionType) {
          case "Achievements":
            return (
              <div key="achievements" className="extra-section-container">
                <h3>Achievements</h3>

                {data.achievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onUpdate={updateAchievement}
                    onDelete={deleteAchievement}
                  />
                ))}

                <div className="section-buttons-row">
                  <button onClick={addAchievement}>
                    <FaPlus /> Add Achievement
                  </button>
                  <button onClick={() => handleSaveExtra("achievements")}>
                    <FaSave /> Save Achievements
                  </button>
                </div>
              </div>
            );

          case "Certifications":
            return (
              <div key="certifications" className="extra-section-container">
                <h3>Certifications</h3>

                {data.certifications.map((cert) => (
                  <CertificationCard
                    key={cert.id}
                    certification={cert}
                    onUpdate={updateCertification}
                    onDelete={deleteCertification}
                  />
                ))}

                <div className="section-buttons-row">
                  <button onClick={addCertification}>
                    <FaPlus /> Add Certification
                  </button>
                  <button onClick={() => handleSaveExtra("certifications")}>
                    <FaSave /> Save Certifications
                  </button>
                </div>
              </div>
            );

          case "Awards":
            return (
              <div key="awards" className="extra-section-container">
                <h3>Awards</h3>

                {data.awards.map((award) => (
                  <AwardCard
                    key={award.id}
                    award={award}
                    onUpdate={updateAward}
                    onDelete={deleteAward}
                  />
                ))}

                <div className="section-buttons-row">
                  <button onClick={addAward}>
                    <FaPlus /> Add Award
                  </button>
                  <button onClick={() => handleSaveExtra("awards")}>
                    <FaSave /> Save Awards
                  </button>
                </div>
              </div>
            );

          case "Languages":
            return (
              <div key="languages" className="extra-section-container">
                <h3>Languages</h3>

                {data.languages.map((language) => (
                  <LanguageCard
                    key={language.id}
                    language={language}
                    onUpdate={updateLanguage}
                    onDelete={deleteLanguage}
                  />
                ))}

                <div className="section-buttons-row">
                  <button onClick={addLanguage}>
                    <FaPlus /> Add Language
                  </button>
                  <button onClick={() => handleSaveExtra("languages")}>
                    <FaSave /> Save Languages
                  </button>
                </div>
              </div>
            );

          case "Interests":
            return (
              <div key="interests" className="extra-section-container">
                <h3>Interests & Hobbies</h3>

                {data.interests.map((interest) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    onUpdate={updateInterest}
                    onDelete={deleteInterest}
                  />
                ))}

                <div className="section-buttons-row">
                  <button onClick={addInterest}>
                    <FaPlus /> Add Interest
                  </button>
                  <button onClick={() => handleSaveExtra("interests")}>
                    <FaSave /> Save Interests
                  </button>
                </div>
              </div>
            );

          default:
            return null;
        }
      })}

      {/* ================= Legacy Extra Sections ================= */}
      {safeExtraSections.map((sec) => (
        <div key={sec.id} className="extra-section-card">
          <div className="extra-section-header">
            <h4>{sec.type}</h4>
            <button onClick={() => handleDeleteExtra(sec.id)}>
              <FaTrash />
            </button>
          </div>

          <textarea
            value={sec.content || ""}
            onChange={(e) => updateExtraContent(sec.id, e.target.value)}
            placeholder={`Enter details about your ${sec.type.toLowerCase()}...`}
          />
        </div>
      ))}

      {/* ================= Add More Sections ================= */}
      <div className="add-section-card">
        <button onClick={() => setShowExtraModal(true)}>
          <FaPlus /> Add More Sections
        </button>
        <p>Add achievements, certifications, awards, or custom sections</p>
      </div>
    </div>
  );
}

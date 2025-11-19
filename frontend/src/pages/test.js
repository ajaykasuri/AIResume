// src/pages/Builder.js
import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../styles/builder.css";
import "../styles/modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTrash } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function Builder({ token }) {
  const [resume, setResume] = useState({
    title: "Ajay's CV",
    template: localStorage.getItem("selectedTemplate") || "modern",
    data: {
      basics: { name: "", jobTitle: "", email: "", phone: "", city: "", country: "" },
      personalStatement: "",
      skills: [],
      experience: [],
      projects: [],
      education: [],
      declaration: { description: "", signature: "" },
      references: [],
      additional: [],
    },
  });

  const [open, setOpen] = useState({
    profile: true,
    personal: false,
    skills: false,
    experience: false,
    projects: false,
    education: false,
    declaration: false,
  });
  const [modal, setModal] = useState(null);

  const toggle = (section) =>
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  const openModal = (type, data) => setModal({ type, data });
  const closeModal = () => setModal(null);

  /* ---------- SAVE / DELETE HELPERS ---------- */
  const saveExperience = (d) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        experience: r.data.experience.find((e) => e.id === d.id)
          ? r.data.experience.map((e) => (e.id === d.id ? d : e))
          : [...r.data.experience, d],
      },
    }));
  };

  const deleteExperience = (id) => {
    setResume((r) => ({
      ...r,
      data: { ...r.data, experience: r.data.experience.filter((e) => e.id !== id) },
    }));
  };

  const saveEducation = (d) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        education: r.data.education.find((e) => e.id === d.id)
          ? r.data.education.map((e) => (e.id === d.id ? d : e))
          : [...r.data.education, d],
      },
    }));
  };

  const deleteEducation = (id) => {
    setResume((r) => ({
      ...r,
      data: { ...r.data, education: r.data.education.filter((e) => e.id !== id) },
    }));
  };

  const saveProject = (d) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        projects: r.data.projects.find((p) => p.id === d.id)
          ? r.data.projects.map((p) => (p.id === d.id ? d : p))
          : [...r.data.projects, d],
      },
    }));
  };

  const deleteProject = (id) => {
    setResume((r) => ({
      ...r,
      data: { ...r.data, projects: r.data.projects.filter((p) => p.id !== id) },
    }));
  };

  /* ---------- BASIC HELPERS ---------- */
  const updateBasics = (field, value) =>
    setResume((r) => ({
      ...r,
      data: { ...r.data, basics: { ...r.data.basics, [field]: value } },
    }));

  const addSkill = (s) => {
    if (!s.trim()) return;
    setResume((r) => ({
      ...r,
      data: { ...r.data, skills: [...r.data.skills, s.trim()] },
    }));
  };

  const removeSkill = (i) =>
    setResume((r) => ({
      ...r,
      data: { ...r.data, skills: r.data.skills.filter((_, idx) => idx !== i) },
    }));

  const updateDeclaration = (field, value) =>
    setResume((r) => ({
      ...r,
      data: { ...r.data, declaration: { ...r.data.declaration, [field]: value } },
    }));

  /* ---------- SAVE & DOWNLOAD ---------- */
  const save = async () => {
    try {
      const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.post(API + "/api/resumes", resume, opts);
      alert("Saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Save failed");
    }
  };

  const downloadResume = async () => {
    try {
      const previewEl = document.querySelector(".preview");
      if (!previewEl) throw new Error("Preview not found");

      const headerButtons = document.querySelector(".builder-header .flex");
      if (headerButtons) headerButtons.style.display = "none";

      const canvas = await html2canvas(previewEl as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      if (headerButtons) headerButtons.style.display = "flex";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`${resume.title.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF failed:", err);
      alert("Failed to generate PDF.");
    }
  };

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="builder-container">
      <header className="builder-header">
        <h2>{resume.title}</h2>
        <div className="flex gap-2">
          <button onClick={downloadResume} className="primary-btn">
            Download
          </button>
          <button onClick={save} className="primary-btn">
            Save
          </button>
        </div>
      </header>

      <div className="builder-content">
        {/* LEFT PANEL */}
        <div className="builder-left">
          {/* PROFILE */}
          <div className="card">
            <div className="card-header" onClick={() => toggle("profile")}>
              <span>Basic Info</span>
              <span className="arrow">{open.profile ? "Up" : "Down"}</span>
            </div>
            {open.profile && (
              <div className="card-body">
                <div className="row two">
                  <label>Name</label>
                  <input value={resume.data.basics.name} onChange={(e) => updateBasics("name", e.target.value)} />
                  <label>Job Title</label>
                  <input value={resume.data.basics.jobTitle} onChange={(e) => updateBasics("jobTitle", e.target.value)} />
                </div>
                <div className="row two">
                  <label>Email</label>
                  <input value={resume.data.basics.email} onChange={(e) => updateBasics("email", e.target.value)} />
                  <label>Phone</label>
                  <input value={resume.data.basics.phone} onChange={(e) => updateBasics("phone", e.target.value)} />
                </div>
                <div className="row two">
                  <label>City</label>
                  <input value={resume.data.basics.city} onChange={(e) => updateBasics("city", e.target.value)} />
                  <label>Country</label>
                  <input value={resume.data.basics.country} onChange={(e) => updateBasics("country", e.target.value)} />
                </div>
              </div>
            )}
          </div>

          {/* PERSONAL STATEMENT */}
          <div className="card">
            <div className="card-header" onClick={() => toggle("personal")}>
              <span>Summary</span>
              <span className="arrow">{open.personal ? "Up" : "Down"}</span>
            </div>
            {open.personal && (
              <div className="card-body">
                <textarea
                  value={resume.data.personalStatement}
                  onChange={(e) => setResume((r) => ({ ...r, data: { ...r.data, personalStatement: e.target.value } }))}
                  placeholder="Write about yourself..."
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="card">
            <div className="card-header" onClick={() => toggle("experience")}>
              <span>Experience</span>
              <span className="arrow">{open.experience ? "Up" : "Down"}</span>
            </div>
            {open.experience && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  When filling out your work experience, be sure to provide specific details...
                </p>
                {resume.data.experience.map((exp) => (
                  <div key={exp.id} className="entry-card" onClick={() => openModal("exp", exp)}>
                    <div>
                      <strong>{exp.title || "Untitled Role"}</strong>
                      <div className="text-sm text-gray-600">{exp.employer}</div>
                      <div className="text-xs text-gray-500">
                        {exp.from ? new Date(exp.from).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"} –{" "}
                        {exp.current ? "Present" : exp.to ? new Date(exp.to).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                      </div>
                    </div>
                    <FaTrash className="trash-icon" onClick={(e) => { e.stopPropagation(); deleteExperience(exp.id); }} />
                  </div>
                ))}
                <button className="add-entry-btn" onClick={() => openModal("exp")}>+ Add Work Experience</button>
              </div>
            )}
          </div>

          {/* PROJECTS */}
          <div className="card">
            <div className="card-header" onClick={() => toggle("projects")}>
              <span>Projects</span>
              <span className="arrow">{open.projects ? "Up" : "Down"}</span>
            </div>
            {open.projects && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Showcase your best projects with title, description, and live link.
                </p>

                {resume.data.projects.map((proj) => (
                  <div key={proj.id} className="entry-card" onClick={() => openModal("proj", proj)}>
                    <div>
                      <strong>{proj.title || "Untitled Project"}</strong>
                      {proj.link && (
                        <div className="text-xs text-blue-600 underline">{proj.link}</div>
                      )}
                    </div>
                    <FaTrash className="trash-icon" onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }} />
                  </div>
                ))}

                <button className="add-entry-btn" onClick={() => openModal("proj")}>
                  + Add Project
                </button>
              </div>
            )}
          </div>

          {/* EDUCATION */}
          <div className="card">
            <div className="card-header" onClick={() => toggle("education")}>
              <span>Education</span>
              <span className="arrow">{open.education ? "Up" : "Down"}</span>
            </div>
            {open.education && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  List your educational background.
                </p>
                {resume.data.education.map((edu) => (
                  <div key={edu.id} className="entry-card" onClick={() => openModal("edu", edu)}>
                    <div>
                      <strong>{edu.degree || "Degree"}</strong>
                      <div className="text-sm text-gray-600">{edu.institution}</div>
                      <div className="text-xs text-gray-500">
                        {edu.from ? new Date(edu.from).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"} –{" "}
                        {edu.current ? "Present" : edu.to ? new Date(edu.to).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                      </div>
                    </div>
                    <FaTrash className="trash-icon" onClick={(e) => { e.stopPropagation(); deleteEducation(edu.id); }} />
                  </div>
                ))}
                <button className="add-entry-btn" onClick={() => openModal("edu")}>+ Add Education</button>
              </div>
            )}
          </div>

          {/* DECLARATION */}
          <div className="card">
            <div className="card-header" onClick={() => toggle("declaration")}>
              <span>Declaration</span>
              <span className="arrow">{open.declaration ? "Up" : "Down"}</span>
            </div>
            {open.declaration && (
              <div className="card-body">
                <textarea
                  rows={4}
                  placeholder="I hereby declare..."
                  value={resume.data.declaration.description}
                  onChange={(e) => updateDeclaration("description", e.target.value)}
                />
                <input
                  placeholder="Your Name (Signature)"
                  value={resume.data.declaration.signature}
                  onChange={(e) => updateDeclaration("signature", e.target.value)}
                  style={{ marginTop: 10 }}
                />
              </div>
            )}
          </div>

          {/* SKILLS */}
          <div className="card">
            <div className="card-header" onClick={() => toggle("skills")}>
              <span>Skills</span>
              <span className="arrow">{open.skills ? "Up" : "Down"}</span>
            </div>
            {open.skills && (
              <div className="card-body">
                <input
                  placeholder="Add skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSkill(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <div className="skill-chips">
                  {resume.data.skills.map((s, i) => (
                    <div key={i} className="chip">
                      {s} <button onClick={() => removeSkill(i)}>X</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="builder-right">
          <div className="preview">
            <h3>{resume.data.basics.name || "Your Name"}</h3>
            <p>{resume.data.basics.jobTitle}</p>
            <hr />
            <p><strong>Email:</strong> {resume.data.basics.email}</p>
            <p><strong>Phone:</strong> {resume.data.basics.phone}</p>
            <p><strong>Location:</strong> {resume.data.basics.city}, {resume.data.basics.country}</p>

            {resume.data.personalStatement && (
              <>
                <h4>Professional Summary</h4>
                <p>{resume.data.personalStatement}</p>
              </>
            )}

            <h4>Skills</h4>
            <p>{resume.data.skills.join(", ")}</p>

            <h4>Experience</h4>
            {resume.data.experience.map((exp) => (
              <div key={exp.id} className="preview-block">
                <strong>{exp.title}</strong> @ {exp.employer}
                <br />
                {exp.from && new Date(exp.from).toLocaleDateString("en-US", { month: "short", year: "numeric" })} –{" "}
                {exp.current ? "Present" : exp.to && new Date(exp.to).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                <div dangerouslySetInnerHTML={{ __html: exp.description }} className="ql-editor" />
              </div>
            ))}

            <h4>Projects</h4>
            {resume.data.projects.map((proj) => (
              <div key={proj.id} className="preview-block">
                <strong>{proj.title}</strong>
                {proj.link && (
                  <>
                    {" "}
                    <a href={proj.link} target="_blank" rel="noopener noreferrer">(link)</a>
                  </>
                )}
                <div dangerouslySetInnerHTML={{ __html: proj.description }} className="ql-editor" />
              </div>
            ))}

            <h4>Education</h4>
            {resume.data.education.map((edu) => (
              <div key={edu.id} className="preview-block">
                <strong>{edu.degree}</strong> – {edu.institution}
                <br />
                {edu.from && new Date(edu.from).toLocaleDateString("en-US", { month: "short", year: "numeric" })} –{" "}
                {edu.current ? "Present" : edu.to && new Date(edu.to).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
            ))}

            {resume.data.declaration.description && (
              <>
                <h4>Declaration</h4>
                <p>{resume.data.declaration.description}</p>
                <p style={{ textAlign: "right" }}>
                  <em>— {resume.data.declaration.signature}</em>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <EntryModal
          type={modal.type}
          data={modal.data}
          onSave={
            modal.type === "exp" ? saveExperience :
            modal.type === "edu" ? saveEducation :
            saveProject
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
}

/* ========== MODAL COMPONENT ========== */
function EntryModal({ type, data, onSave, onClose }) {
  const isExp = type === "exp";
  const isProj = type === "proj";

  const [title, setTitle] = useState(isExp ? data?.title ?? "" : isProj ? data?.title ?? "" : "");
  const [employer, setEmployer] = useState(isExp ? data?.employer ?? "" : "");
  const [degree, setDegree] = useState(!isExp && !isProj ? data?.degree ?? "" : "");
  const [institution, setInstitution] = useState(!isExp && !isProj ? data?.institution ?? "" : "");
  const [from, setFrom] = useState(data?.from ? new Date(data.from) : null);
  const [to, setTo] = useState(data?.to ? new Date(data.to) : null);
  const [current, setCurrent] = useState(data?.current ?? false);
  const [description, setDescription] = useState((isExp || isProj) ? data?.description ?? "" : "");
  const [link, setLink] = useState(isProj ? data?.link ?? "" : "");

  const handleSave = () => {
    const saved = isExp
      ? { id: data?.id ?? crypto.randomUUID(), title, employer, from, to: current ? null : to, current, description }
      : isProj
      ? { id: data?.id ?? crypto.randomUUID(), title, description, link }
      : { id: data?.id ?? crypto.randomUUID(), degree, institution, from, to: current ? null : to, current };

    onSave(saved);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {isExp ? "Work Experience" : isProj ? "Project" : "Education"}
          </h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {isExp ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="block mb-1 font-medium">Job Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Software Engineer" /></div>
                <div><label className="block mb-1 font-medium">Employer</label><input value={employer} onChange={(e) => setEmployer(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Google Inc." /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="block mb-1 font-medium">From</label><DatePicker selected={from} onChange={setFrom} className="w-full border rounded px-3 py-2" placeholderText="mm/dd/yyyy" /></div>
                <div><label className="block mb-1 font-medium">To</label><DatePicker selected={current ? null : to} onChange={setTo} className="w-full border rounded px-3 py-2" placeholderText="mm/dd/yyyy" disabled={current} /></div>
              </div>
              <div className="mb-4 flex items-center space-x-2">
                <input type="checkbox" id="current-work" checked={current} onChange={(e) => setCurrent(e.target.checked)} className="h-4 w-4 text-blue-600 rounded" />
                <label htmlFor="current-work" className="select-none cursor-pointer">I currently work here</label>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Description</label>
                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={{ toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link"]] }} />
              </div>
            </>
          ) : isProj ? (
            <>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Project Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="E-commerce Platform" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Live Link / GitHub</label>
                <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="https://github.com/..." />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Description</label>
                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={{ toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link"]] }} />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="block mb-1 font-medium">Degree</label><input value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="B.Tech" /></div>
                <div><label className="block mb-1 font-medium">Institution</label><input value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="IIT Delhi" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="block mb-1 font-medium">From</label><DatePicker selected={from} onChange={setFrom} className="w-full border rounded px-3 py-2" placeholderText="mm/dd/yyyy" /></div>
                <div><label className="block mb-1 font-medium">To</label><DatePicker selected={current ? null : to} onChange={setTo} className="w-full border rounded px-3 py-2" placeholderText="mm/dd/yyyy" disabled={current} /></div>
              </div>
              <div className="mb-4 flex items-center space-x-2">
                <input type="checkbox" id="current-study" checked={current} onChange={(e) => setCurrent(e.target.checked)} className="h-4 w-4 text-blue-600 rounded" />
                <label htmlFor="current-study" className="select-none cursor-pointer">I am currently studying here</label>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
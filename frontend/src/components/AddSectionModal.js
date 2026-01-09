// src/components/modals/AddSectionModal.js
import React, { useState } from "react";
import { X } from "lucide-react";
import "../styles/AddSectionModal .css"
const ALL_SECTIONS = [
  { key: "summary", name: "Summary" },
  { key: "experience", name: "Experience" },
  { key: "education", name: "Education" },
  { key: "skills", name: "Skills" },
  { key: "language", name: "Languages" },
  { key: "projects", name: "Projects" },
  { key: "achievements", name: "Achievements" },
  { key: "certificates", name: "Certifications" },
  { key: "publications", name: "Publications" },
  { key: "internships", name: "Internships" },
  { key: "volunteer", name: "Volunteer" },
  { key: "interests", name: "Interests" },
  { key: "references", name: "References" },
  { key: "declaration", name: "Declaration" },
];

export default function AddSectionModal({ currentSelection, onClose, onSave }) {
  const [selected, setSelected] = useState(currentSelection);

  const toggle = (key) => {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((s) => s !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="section-modal-overlay">
      <div className="section-modal">
        <div className="modal-header">
          <h2>Add More Sections</h2>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="modal-body">
          {ALL_SECTIONS.map((s) => (
            <div
              key={s.key}
              className={`section-option ${
                selected.includes(s.key) ? "selected" : ""
              }`}
              onClick={() => toggle(s.key)}
            >
              {s.name}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSave(selected)}>Save</button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/modal.css"; // We'll override with inline modern styles

export default function ModalContent({ type, data, onSave, onClose }) {
  const isExp = type === "exp";
  const isProj = type === "proj";

  // Core fields
  const [title, setTitle] = useState(isExp ? data?.title ?? "" : isProj ? data?.title ?? "" : "");
  const [employer, setEmployer] = useState(isExp ? data?.employer ?? "" : "");
  const [degree, setDegree] = useState(!isExp && !isProj ? data?.degree ?? "" : "");
  const [institution, setInstitution] = useState(!isExp && !isProj ? data?.institution ?? "" : "");
  const [from, setFrom] = useState(data?.from ? new Date(data.from) : null);
  const [to, setTo] = useState(data?.to ? new Date(data.to) : null);
  const [current, setCurrent] = useState(data?.current ?? false);
  const [description, setDescription] = useState((isExp || isProj) ? data?.summary ?? "" : "");
  const [link, setLink] = useState(isProj ? data?.link ?? "" : "");

  // Project optional fields
  const [roleEnabled, setRoleEnabled] = useState(!!data?.projectRole);
  const [clientEnabled, setClientEnabled] = useState(!!data?.clientName);
  const [teamSizeEnabled, setTeamSizeEnabled] = useState(!!data?.teamSize);

  const [projectRole, setProjectRole] = useState(data?.projectRole ?? "");
  const [clientName, setClientName] = useState(data?.clientName ?? "");
  const [teamSize, setTeamSize] = useState(data?.teamSize ?? "");

  const maxDescriptionLength = 500;

  const handleDescriptionChange = (content, delta, source, editor) => {
    const text = editor.getText().trim();
    if (text.length <= maxDescriptionLength) {
      setDescription(content);
    }
  };

  const handleSave = () => {
    const saved = isExp
      ? {
          id: data?.id ?? crypto.randomUUID(),
          title,
          employer,
          from,
          to: current ? null : to,
          current,
          summary: description,
        }
      : isProj
      ? {
          id: data?.id ?? crypto.randomUUID(),
          title,
          summary: description,
          link,
          projectRole: roleEnabled ? projectRole : undefined,
          clientName: clientEnabled ? clientName : undefined,
          teamSize: teamSizeEnabled ? teamSize : undefined,
          duration: { from, to: current ? null : to },
        }
      : {
          id: data?.id ?? crypto.randomUUID(),
          degree,
          institution,
          from,
          to: current ? null : to,
          current,
        };

    onSave(saved);
    onClose();
  };

  // Auto-focus first input
  const firstInputRef = useRef(null);
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{isExp ? "Work Experience" : isProj ? "Project" : "Education"}</h3>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {isExp ? (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Job Title / Role</label>
                    <input
                      ref={firstInputRef}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Organization</label>
                    <input
                      value={employer}
                      onChange={(e) => setEmployer(e.target.value)}
                      placeholder="Google Inc."
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>From</label>
                    <DatePicker
                      selected={from}
                      onChange={setFrom}
                      placeholderText="mm/dd/yyyy"
                      className="date-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>To</label>
                    <DatePicker
                      selected={current ? null : to}
                      onChange={setTo}
                      placeholderText="mm/dd/yyyy"
                      className="date-input"
                      disabled={current}
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={current}
                      onChange={(e) => setCurrent(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    I currently work here
                  </label>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={handleDescriptionChange}
                    modules={{
                      toolbar: [
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                      ],
                    }}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                  <div className="char-count">
                    {description.replace(/<[^>]+>/g, "").length} / {maxDescriptionLength}
                  </div>
                </div>
              </>
            ) : isProj ? (
              <>
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    ref={firstInputRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E-commerce Platform"
                  />
                </div>

                <div className="form-group">
                  <label>Live Link / GitHub</label>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                {/* Optional Fields */}
                <div className="optional-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={roleEnabled}
                      onChange={(e) => setRoleEnabled(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Add Project Role
                  </label>
                  {roleEnabled && (
                    <input
                      value={projectRole}
                      onChange={(e) => setProjectRole(e.target.value)}
                      placeholder="e.g., Full Stack Developer"
                      className="optional-input"
                    />
                  )}
                </div>

                <div className="optional-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={clientEnabled}
                      onChange={(e) => setClientEnabled(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Add Client Name
                  </label>
                  {clientEnabled && (
                    <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., ABC Corp"
                      className="optional-input"
                    />
                  )}
                </div>

                <div className="optional-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={teamSizeEnabled}
                      onChange={(e) => setTeamSizeEnabled(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Add Team Size
                  </label>
                  {teamSizeEnabled && (
                    <input
                      type="number"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      placeholder="5"
                      min="1"
                      className="optional-input"
                    />
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>From</label>
                    <DatePicker
                      selected={from}
                      onChange={setFrom}
                      placeholderText="mm/dd/yyyy"
                      className="date-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>To</label>
                    <DatePicker
                      selected={current ? null : to}
                      onChange={setTo}
                      placeholderText="mm/dd/yyyy"
                      className="date-input"
                      disabled={current}
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={current}
                      onChange={(e) => setCurrent(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Currently working on this project
                  </label>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={handleDescriptionChange}
                    modules={{
                      toolbar: [
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                      ],
                    }}
                    placeholder="Explain the project, tech stack, and your contribution..."
                  />
                  <div className="char-count">
                    {description.replace(/<[^>]+>/g, "").length} / {maxDescriptionLength}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      ref={firstInputRef}
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="B.Tech in Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>Institution</label>
                    <input
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="IIT Delhi"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>From</label>
                    <DatePicker
                      selected={from}
                      onChange={setFrom}
                      placeholderText="mm/dd/yyyy"
                      className="date-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>To</label>
                    <DatePicker
                      selected={current ? null : to}
                      onChange={setTo}
                      placeholderText="mm/dd/yyyy"
                      className="date-input"
                      disabled={current}
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={current}
                      onChange={(e) => setCurrent(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Currently studying here
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-save" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Modern Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          width: 90%;
          max-width: 640px;
          max-height: 90vh;
          overflow: hidden;
          animation: slideUp 0.35s ease-out;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .modal-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          color: #64748b;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f1f5f9;
          color: #475569;
        }

        .modal-body {
          padding: 1.5rem;
          max-height: calc(90vh - 140px);
          overflow-y: auto;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          background: #f8fafc;
        }

        /* Form Styling */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
          font-size: 0.95rem;
        }

        .form-group input,
        .date-input {
          padding: 0.75rem 1rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #ffffff;
        }

        .form-group input:focus,
        .date-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .optional-input {
          margin-top: 0.5rem;
          margin-left: 1.75rem;
        }

        .checkbox-group {
          margin-bottom: 1.25rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          color: #475569;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-label input {
          opacity: 0;
          position: absolute;
        }

        .checkmark {
          position: relative;
          width: 18px;
          height: 18px;
          border: 2px solid #94a3b8;
          border-radius: 6px;
          margin-right: 0.75rem;
          transition: all 0.2s;
        }

        .checkbox-label input:checked ~ .checkmark {
          background: #3b82f6;
          border-color: #3b82f6;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-label input:checked ~ .checkmark:after {
          display: block;
        }

        .optional-section {
          margin-bottom: 1rem;
        }

        .char-count {
          text-align: right;
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.35rem;
        }

        /* Buttons */
        .btn {
          padding: 0.65rem 1.5rem;
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-cancel {
          background: #e2e8f0;
          color: #475569;
        }

        .btn-cancel:hover {
          background: #cbd5e1;
        }

        .btn-save {
          background: #3b82f6;
          color: white;
        }

        .btn-save:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Quill Editor */
        :global(.ql-container) {
          border-bottom-left-radius: 10px !important;
          border-bottom-right-radius: 10px !important;
          min-height: 140px;
          font-size: 1rem;
        }

        :global(.ql-toolbar) {
          border-top-left-radius: 10px !important;
          border-top-right-radius: 10px !important;
          background: #f8fafc;
        }

        :global(.ql-editor) {
          line-height: 1.7;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .modal-content {
            width: 95%;
            border-radius: 12px;
          }
          .modal-header h3 {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </>
  );
}
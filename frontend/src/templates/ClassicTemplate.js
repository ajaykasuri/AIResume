// templates/ClassicTemplateWord.jsx
import React from "react";

const ClassicTemplateWord = ({ data = {} }) => {
  const {
    basics = {},
    personalStatement = "",
    experience = [],
    projects = [],
    education = [],
    skills = [],
    declaration = {},
    languages = [],
    certifications = [],
    achievements = [],
    awards = [],
    interests = [],
  } = data;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const formatYear = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        background: "#ffffff",
        color: "#222222",
        padding: "32px 40px",
        fontFamily: "Segoe UI, Arial, sans-serif",
        fontSize: "12pt",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <h1
          style={{
            fontSize: "28pt",
            margin: "0 0 10px 0",
            fontWeight: "bold",
            color: "#222222",
          }}
        >
          {basics.name || "Your Name"}
        </h1>
        <div
          style={{
            fontFamily: "Segoe UI, Arial, sans-serif",
            fontSize: "10pt",
            color: "#555555",
            marginBottom: "15px",
          }}
        >
          {basics.email && (
            <span style={{ margin: "0 5px" }}>{basics.email}</span>
          )}
          {basics.email && basics.phone && (
            <span style={{ margin: "0 5px" }}>•</span>
          )}
          {basics.phone && (
            <span style={{ margin: "0 5px" }}>{basics.phone}</span>
          )}
          {(basics.email || basics.phone) && basics.city && (
            <span style={{ margin: "0 5px" }}>•</span>
          )}
          {basics.city && (
            <span style={{ margin: "0 5px" }}>
              {basics.city}
              {basics.country ? `, ${basics.country}` : ""}
            </span>
          )}
          {(basics.email || basics.phone || basics.city) && basics.linkedIn && (
            <span style={{ margin: "0 5px" }}>•</span>
          )}
          {basics.linkedIn && (
            <span style={{ margin: "0 5px" }}>{basics.linkedIn}</span>
          )}
        </div>
        <hr
          style={{
            border: "none",
            height: "1px",
            backgroundColor: "#dddddd",
            margin: "20px 0 0",
          }}
        />
      </div>

      {/* Profile */}
      {personalStatement && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "6px",
                marginTop: "20px",
                color: "#222222",
              }}
            >
              PROFILE
            </div>
            <div
              style={{
                marginLeft: "1.2em",
                color: "#222222",
                fontSize: "11pt",
                lineHeight: "1.4",
              }}
            >
              {personalStatement}
            </div>
          </div>
          <hr
            style={{
              margin: "20px 0 14px",
              border: "none",
              borderTop: "1px solid #bbbbbb",
            }}
          />
        </>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "6px",
                marginTop: "20px",
                color: "#222222",
              }}
            >
              LANGUAGES
            </div>
            <ul
              style={{
                margin: "0 0 14px 20px",
                padding: "0",
                color: "#222222",
                fontSize: "11pt",
              }}
            >
              {languages.map((lang, i) => (
                <li key={i} style={{ marginBottom: "4px", lineHeight: "1.3" }}>
                  <b>{lang.name}</b> - {lang.proficiency}
                </li>
              ))}
            </ul>
          </div>
          <hr
            style={{
              margin: "20px 0 14px",
              border: "none",
              borderTop: "1px solid #bbbbbb",
            }}
          />
        </>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "6px",
                marginTop: "20px",
                color: "#222222",
              }}
            >
              EXPERIENCE
            </div>
            {experience.map((exp, idx) => (
              <div
                key={idx}
                style={{ marginBottom: "14px", paddingLeft: "1.2em" }}
              >
                <table
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{ marginBottom: "5px" }}
                >
                  <tr>
                    <td
                      style={{
                        fontWeight: "bold",
                        fontSize: "11pt",
                        color: "#222222",
                      }}
                    >
                      {exp.title || exp.position}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: "10pt",
                        color: "#444444",
                        width: "30%",
                      }}
                    >
                      {formatDate(exp.from)} –{" "}
                      {exp.current ? "Present" : formatDate(exp.to)}
                    </td>
                  </tr>
                </table>
                <div
                  style={{
                    color: "#666666",
                    fontSize: "10pt",
                    marginBottom: "4px",
                  }}
                >
                  {exp.employer}
                  {exp.location ? ", " + exp.location : ""}
                </div>
                {exp.description && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.4",
                      color: "#222222",
                    }}
                  >
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
          <hr
            style={{
              margin: "20px 0 14px",
              border: "none",
              borderTop: "1px solid #bbbbbb",
            }}
          />
        </>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "6px",
                marginTop: "20px",
                color: "#222222",
              }}
            >
              PROJECTS
            </div>
            {projects.map((proj, idx) => (
              <div
                key={idx}
                style={{ marginBottom: "14px", paddingLeft: "1.2em" }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "11pt",
                    marginBottom: "5px",
                    color: "#222222",
                  }}
                >
                  {proj.title}
                </div>
                {proj.link && (
                  <div
                    style={{
                      fontSize: "10pt",
                      marginBottom: "5px",
                      color: "#222222",
                    }}
                  >
                    <a href={proj.link} style={{ color: "#222222" }}>
                      {proj.link}
                    </a>
                  </div>
                )}
                {proj.description && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.4",
                      color: "#222222",
                    }}
                  >
                    {proj.description}
                  </div>
                )}
              </div>
            ))}
          </div>
          <hr
            style={{
              margin: "20px 0 14px",
              border: "none",
              borderTop: "1px solid #bbbbbb",
            }}
          />
        </>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "6px",
                marginTop: "20px",
                color: "#222222",
              }}
            >
              SKILLS
            </div>
            <ul
              style={{
                margin: "0 0 14px 20px",
                padding: "0",
                color: "#222222",
                fontSize: "11pt",
              }}
            >
              {skills.map((s, i) => (
                <li key={i} style={{ marginBottom: "4px", lineHeight: "1.3" }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <hr
            style={{
              margin: "20px 0 14px",
              border: "none",
              borderTop: "1px solid #bbbbbb",
            }}
          />
        </>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "6px",
                marginTop: "20px",
                color: "#222222",
              }}
            >
              EDUCATION
            </div>
            {education.map((edu, i) => (
              <div
                key={i}
                style={{ marginBottom: "14px", paddingLeft: "1.2em" }}
              >
                <table
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{ marginBottom: "5px" }}
                >
                  <tr>
                    <td
                      style={{
                        fontWeight: "bold",
                        fontSize: "11pt",
                        color: "#222222",
                      }}
                    >
                      {edu.degree}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: "10pt",
                        color: "#444444",
                        width: "30%",
                      }}
                    >
                      {formatYear(edu.from)}
                      {edu.to ? ` - ${formatYear(edu.to)}` : ""}
                    </td>
                  </tr>
                </table>
                <div style={{ color: "#666666", fontSize: "10pt" }}>
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
          <hr
            style={{
              margin: "20px 0 14px",
              border: "none",
              borderTop: "1px solid #bbbbbb",
            }}
          />
        </>
      )}

      {/* Declaration */}
      {declaration && declaration.description && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "6px",
                marginTop: "20px",
                color: "#222222",
              }}
            >
              DECLARATION
            </div>
            <div
              style={{ fontSize: "11pt", lineHeight: "1.4", color: "#222222" }}
            >
              {declaration.description}
            </div>
            {declaration.signature && (
              <div
                style={{
                  textAlign: "right",
                  marginTop: "15px",
                  fontSize: "11pt",
                }}
              >
                {declaration.signature}
              </div>
            )}
          </div>
          <hr
            style={{
              margin: "20px 0 14px",
              border: "none",
              borderTop: "1px solid #bbbbbb",
            }}
          />
        </>
      )}
    </div>
  );
};

export default ClassicTemplateWord;

// templates/ExecutiveTemplateWord.jsx
import React from "react";

const ExecutiveTemplateWord = ({ data = {} }) => {
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

  return (
    <table
      width="100%"
      border="0"
      cellPadding="0"
      cellSpacing="0"
      style={{ fontFamily: "Georgia, serif", fontSize: "12pt" }}
    >
      <tr>
        {/* Sidebar Column */}
        <td
          width="35%"
          valign="top"
          style={{
            backgroundColor: "#295040",
            color: "white",
            padding: "20px",
          }}
        >
          {/* Name and Title */}
          <div style={{ marginBottom: "30px" }}>
            <h1
              style={{
                color: "white",
                fontSize: "22pt",
                margin: "0 0 5px 0",
                fontWeight: "bold",
              }}
            >
              {basics.name || "Your Name"}
            </h1>
            <div
              style={{
                color: "#efeeef",
                fontSize: "12pt",
                fontStyle: "italic",
                marginBottom: "10px",
              }}
            >
              {basics.jobTitle || "Your Job Title"}
            </div>
          </div>

          {/* Contact Information */}
          <table
            width="100%"
            cellPadding="0"
            cellSpacing="0"
            style={{
              marginBottom: "25px",
              borderSpacing: "0",
              borderCollapse: "collapse",
              lineHeight: "1",
            }}
          >
            <tbody>
              {basics.email && (
                <tr>
                  {/* Reduced width to 20 pixels */}
                  <td
                    width="20"
                    valign="top"
                    style={{
                      color: "white",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    ✉️
                  </td>
                  <td
                    style={{
                      color: "white",
                      fontSize: "10pt",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    {basics.email}
                  </td>
                </tr>
              )}
              {basics.phone && (
                <tr>
                  {/* Reduced width to 20 pixels */}
                  <td
                    width="20"
                    valign="top"
                    style={{
                      color: "white",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    📞
                  </td>
                  <td
                    style={{
                      color: "white",
                      fontSize: "10pt",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    {basics.phone}
                  </td>
                </tr>
              )}
              {basics.city && (
                <tr>
                  {/* Reduced width to 20 pixels */}
                  <td
                    width="20"
                    valign="top"
                    style={{
                      color: "white",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    📍
                  </td>
                  <td
                    style={{
                      color: "white",
                      fontSize: "10pt",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    {basics.city}
                    {basics.country ? `, ${basics.country}` : ""}
                  </td>
                </tr>
              )}
              {basics.linkedIn && (
                <tr>
                  {/* Reduced width to 20 pixels */}
                  <td
                    width="20"
                    valign="top"
                    style={{
                      color: "white",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    🔗
                  </td>
                  <td
                    style={{
                      color: "white",
                      fontSize: "10pt",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    {basics.linkedIn}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Profile */}
          {personalStatement && (
            <div style={{ marginBottom: "25px" }}>
              <h3
                style={{
                  color: "#96ddbf",
                  borderBottom: "1px solid #4a6b5d",
                  paddingBottom: "3px",
                  fontSize: "11pt",
                  margin: "0 0 10px 0",
                }}
              >
                PROFILE
              </h3>
              <div
                style={{
                  color: "#ddeade",
                  fontSize: "10pt",
                  lineHeight: "1.4",
                }}
              >
                {personalStatement}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <div
                style={{
                  fontSize: "12pt",
                  fontWeight: "bold",
                  color: "#2e7d32",
                  marginBottom: "12px",
                  borderBottom: "2px solid #2e7d32",
                  paddingBottom: "4px",
                  paddingLeft: "20px",
                }}
              >
                SKILLS
              </div>
              <div
                style={{ fontSize: "10pt", color: "#ffff", paddingLeft: "5px" }}
              >
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "6px",
                      paddingLeft: "45px",
                      textIndent: "-15px",
                      lineHeight: "1.4",
                    }}
                  >
                    • {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h3
                style={{
                  color: "#96ddbf",
                  borderBottom: "1px solid #4a6b5d",
                  paddingBottom: "3px",
                  fontSize: "11pt",
                  margin: "0 0 10px 0",
                }}
              >
                EDUCATION
              </h3>
              {education.map((edu, index) => (
                <div key={index} style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "10pt",
                    }}
                  >
                    {edu.institution}
                  </div>
                  <div
                    style={{
                      color: "#cfe1d7",
                      fontSize: "9pt",
                      fontStyle: "italic",
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div style={{ color: "#b6d2c5", fontSize: "9pt" }}>
                    {formatDate(edu.from)} -{" "}
                    {edu.current ? "Present" : formatDate(edu.to)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h3
                style={{
                  color: "#96ddbf",
                  borderBottom: "1px solid #4a6b5d",
                  paddingBottom: "3px",
                  fontSize: "11pt",
                  margin: "0 0 10px 0",
                }}
              >
                LANGUAGES
              </h3>
              <ul
                style={{
                  color: "#ddeade",
                  fontSize: "10pt",
                  paddingLeft: "15px",
                  margin: 0,
                }}
              >
                {languages.map((lang, index) => (
                  <li key={index} style={{ marginBottom: "3px" }}>
                    <strong>{lang.name}</strong>
                    {lang.proficiency && ` - ${lang.proficiency}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </td>

        {/* Main Content Column */}
        <td
          width="65%"
          valign="top"
          style={{ padding: "20px", backgroundColor: "white" }}
        >
          {/* Professional Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h3
                style={{
                  color: "#335d46",
                  borderBottom: "1px solid #d2e1da",
                  paddingBottom: "3px",
                  fontSize: "11pt",
                  margin: "0 0 15px 0",
                }}
              >
                PROFESSIONAL EXPERIENCE
              </h3>
              {experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "3px",
                    }}
                  >
                    {exp.title}
                    {exp.employer && ` — ${exp.employer}`}
                  </div>
                  <div
                    style={{
                      color: "#495659",
                      fontSize: "9pt",
                      marginBottom: "8px",
                    }}
                  >
                    {formatDate(exp.from)} -{" "}
                    {exp.current ? "Present" : formatDate(exp.to)}
                    {exp.location && ` • ${exp.location}`}
                  </div>
                  {exp.description && (
                    <div style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h3
                style={{
                  color: "#335d46",
                  borderBottom: "1px solid #d2e1da",
                  paddingBottom: "3px",
                  fontSize: "11pt",
                  margin: "0 0 15px 0",
                }}
              >
                PROJECTS
              </h3>
              {projects.map((proj, index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "5px",
                    }}
                  >
                    {proj.title}
                  </div>
                  {proj.link && (
                    <div style={{ fontSize: "9pt", marginBottom: "5px" }}>
                      <a href={proj.link} style={{ color: "#295040" }}>
                        {proj.link}
                      </a>
                    </div>
                  )}
                  {proj.description && (
                    <div style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                      {proj.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h3
                style={{
                  color: "#335d46",
                  borderBottom: "1px solid #d2e1da",
                  paddingBottom: "3px",
                  fontSize: "11pt",
                  margin: "0 0 15px 0",
                }}
              >
                CERTIFICATIONS
              </h3>
              {certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "10pt" }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: "9pt" }}>
                    {cert.issuer}
                    {cert.dateObtained && ` • ${cert.dateObtained}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Declaration */}
          {declaration.description && (
            <div style={{ marginBottom: "25px" }}>
              <h3
                style={{
                  color: "#335d46",
                  borderBottom: "1px solid #d2e1da",
                  paddingBottom: "3px",
                  fontSize: "11pt",
                  margin: "0 0 15px 0",
                }}
              >
                DECLARATION
              </h3>
              <div style={{ fontSize: "10pt", lineHeight: "1.4" }}>
                {declaration.description}
              </div>
              {declaration.signature && (
                <div
                  style={{
                    marginTop: "15px",
                    textAlign: "right",
                    fontSize: "10pt",
                  }}
                >
                  {declaration.signature}
                </div>
              )}
            </div>
          )}
        </td>
      </tr>
    </table>
  );
};

export default ExecutiveTemplateWord;

// templates/ElegantTemplateWord.jsx
import React from "react";

const ElegantTemplateWord = ({ data = {} }) => {
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
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const Section = ({ title, children, noHr }) => (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          fontSize: "12pt",
          fontWeight: "bold",
          color: "#ffffff",
          marginBottom: "10px",
          borderBottom: "1px solid #4caf50",
          paddingBottom: "3px",
        }}
      >
        {title}
      </div>
      {children}
      {!noHr && (
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #4caf50",
            margin: "15px 0",
          }}
        />
      )}
    </div>
  );

  return (
    <table
      width="100%"
      border="0"
      cellPadding="0"
      cellSpacing="0"
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "11pt",
        borderCollapse: "collapse",
        width: "100%",
      }}
    >
      <tr>
        {/* Left Column */}
        <td
          width="35%"
          valign="top"
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRight: "1px solid #cccccc",
          }}
        >
          {/* Name and Title */}
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "20pt",
                fontWeight: "bold",
                color: "#000000",
                marginBottom: "5px",
                lineHeight: "1.1",
              }}
            >
              {basics.name || "Your Name"}
            </div>
            <div
              style={{
                fontSize: "12pt",
                color: "#666666",
                fontStyle: "italic",
              }}
            >
              {basics.jobTitle || "Your Job Title"}
            </div>
          </div>

          {/* Contact Information */}
          <table
            width="100%"
            cellPadding="3"
            cellSpacing="0"
            style={{ marginBottom: "20px", borderCollapse: "collapse" }}
          >
            <tbody>
              {basics.email && (
                <tr>
                  <td
                    width="20"
                    valign="top"
                    style={{ color: "#000000", padding: "2px" }}
                  >
                    ✉️
                  </td>
                  <td
                    style={{
                      color: "#000000",
                      fontSize: "9pt",
                      padding: "2px",
                    }}
                  >
                    {basics.email}
                  </td>
                </tr>
              )}
              {basics.phone && (
                <tr>
                  <td
                    width="20"
                    valign="top"
                    style={{ color: "#000000", padding: "2px" }}
                  >
                    📞
                  </td>
                  <td
                    style={{
                      color: "#000000",
                      fontSize: "9pt",
                      padding: "2px",
                    }}
                  >
                    {basics.phone}
                  </td>
                </tr>
              )}
              {basics.city && (
                <tr>
                  <td
                    width="20"
                    valign="top"
                    style={{ color: "#000000", padding: "2px" }}
                  >
                    📍
                  </td>
                  <td
                    style={{
                      color: "#000000",
                      fontSize: "9pt",
                      padding: "2px",
                    }}
                  >
                    {basics.city}
                    {basics.country ? `, ${basics.country}` : ""}
                  </td>
                </tr>
              )}
              {basics.linkedIn && (
                <tr>
                  <td
                    width="20"
                    valign="top"
                    style={{ color: "#000000", padding: "2px" }}
                  >
                    🔗
                  </td>
                  <td
                    style={{
                      color: "#000000",
                      fontSize: "9pt",
                      padding: "2px",
                    }}
                  >
                    {basics.linkedIn}
                  </td>
                </tr>
              )}
              {basics.github && (
                <tr>
                  <td
                    width="20"
                    valign="top"
                    style={{ color: "#000000", padding: "2px" }}
                  >
                    🔗
                  </td>
                  <td
                    style={{
                      color: "#000000",
                      fontSize: "9pt",
                      padding: "2px",
                    }}
                  >
                    {basics.github}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Profile in Sidebar */}
          {personalStatement && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11pt",
                  fontWeight: "bold",
                  color: "#2e7d32",
                  marginBottom: "8px",
                  borderBottom: "1px solid #2e7d32",
                  paddingBottom: "2px",
                }}
              >
                PROFILE
              </div>
              <div
                style={{ fontSize: "9pt", color: "#000000", lineHeight: "1.4" }}
              >
                {personalStatement}
              </div>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e0e0e0",
                  margin: "15px 0",
                }}
              />
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11pt",
                  fontWeight: "bold",
                  color: "#2e7d32",
                  marginBottom: "8px",
                  borderBottom: "1px solid #2e7d32",
                  paddingBottom: "2px",
                }}
              >
                LANGUAGES
              </div>
              <div style={{ fontSize: "9pt", color: "#000000" }}>
                {languages.map((lang, i) => (
                  <div key={i} style={{ marginBottom: "4px" }}>
                    <strong>{lang.name}</strong> - {lang.proficiency}
                  </div>
                ))}
              </div>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e0e0e0",
                  margin: "15px 0",
                }}
              />
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11pt",
                  fontWeight: "bold",
                  color: "#2e7d32",
                  marginBottom: "8px",
                  borderBottom: "1px solid #2e7d32",
                  paddingBottom: "2px",
                }}
              >
                SKILLS
              </div>
              <div style={{ fontSize: "9pt", color: "#000000" }}>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: "4px", paddingLeft: "20px" }}
                  >
                    • {skill}
                  </div>
                ))}
              </div>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e0e0e0",
                  margin: "15px 0",
                }}
              />
            </div>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "11pt",
                  fontWeight: "bold",
                  color: "#2e7d32",
                  marginBottom: "8px",
                  borderBottom: "1px solid #2e7d32",
                  paddingBottom: "2px",
                }}
              >
                INTERESTS
              </div>
              <div style={{ fontSize: "9pt", color: "#000000" }}>
                {interests.map((interest, i) => (
                  <div key={i} style={{ marginBottom: "4px" }}>
                    <strong>{interest.name}</strong>
                    {interest.description && ` - ${interest.description}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </td>

        {/* Right Column */}
        <td
          width="65%"
          valign="top"
          style={{
            backgroundColor: "#3f8143ff",
            color: "#ffffff",
            padding: "20px",
          }}
        >
          {/* Experience */}
          {experience && experience.length > 0 && (
            <Section title="PROFESSIONAL EXPERIENCE">
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "10pt",
                      marginBottom: "3px",
                    }}
                  >
                    {exp.title}
                  </div>
                  <div
                    style={{
                      fontSize: "9pt",
                      color: "#e8f5e8",
                      marginBottom: "3px",
                    }}
                  >
                    {exp.employer} {exp.location ? ", " + exp.location : ""}
                  </div>
                  <div
                    style={{
                      fontSize: "8pt",
                      color: "#c8e6c9",
                      marginBottom: "5px",
                    }}
                  >
                    {exp.from ? formatDate(exp.from) : ""} -
                    {exp.current
                      ? " Present"
                      : exp.to
                      ? formatDate(exp.to)
                      : ""}
                  </div>
                  {exp.description && (
                    <div
                      style={{
                        fontSize: "9pt",
                        lineHeight: "1.4",
                        marginBottom: "10px",
                      }}
                    >
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <Section title="PROJECTS">
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "10pt",
                      marginBottom: "3px",
                    }}
                  >
                    {proj.title}
                  </div>
                  {proj.link && (
                    <div
                      style={{
                        fontSize: "8pt",
                        color: "#e8f5e8",
                        marginBottom: "3px",
                      }}
                    >
                      <a
                        href={proj.link}
                        style={{
                          color: "#e8f5e8",
                          textDecoration: "underline",
                        }}
                      >
                        {proj.link}
                      </a>
                    </div>
                  )}
                  {proj.description && (
                    <div style={{ fontSize: "9pt", lineHeight: "1.4" }}>
                      {proj.description}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <Section title="EDUCATION">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "10pt",
                      marginBottom: "3px",
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div
                    style={{
                      fontSize: "9pt",
                      color: "#e8f5e8",
                      marginBottom: "3px",
                    }}
                  >
                    {edu.institution}
                  </div>
                  <div style={{ fontSize: "8pt", color: "#c8e6c9" }}>
                    {edu.from ? formatDate(edu.from) : ""} -
                    {edu.current
                      ? " Present"
                      : edu.to
                      ? formatDate(edu.to)
                      : ""}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <Section title="ACHIEVEMENTS">
              {achievements.map((achievement, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "10pt",
                      marginBottom: "3px",
                    }}
                  >
                    {achievement.title}
                  </div>
                  {achievement.date && (
                    <div
                      style={{
                        fontSize: "8pt",
                        color: "#c8e6c9",
                        marginBottom: "3px",
                      }}
                    >
                      {achievement.date}
                    </div>
                  )}
                  {achievement.description && (
                    <div style={{ fontSize: "9pt", lineHeight: "1.4" }}>
                      {achievement.description}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <Section title="CERTIFICATIONS">
              {certifications.map((cert, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "10pt",
                      marginBottom: "3px",
                    }}
                  >
                    {cert.name}
                  </div>
                  <div
                    style={{
                      fontSize: "9pt",
                      color: "#e8f5e8",
                      marginBottom: "3px",
                    }}
                  >
                    {cert.issuer}
                  </div>
                  {cert.dateObtained && (
                    <div style={{ fontSize: "8pt", color: "#c8e6c9" }}>
                      {cert.dateObtained}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <Section title="AWARDS">
              {awards.map((award, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "10pt",
                      marginBottom: "3px",
                    }}
                  >
                    {award.title}
                  </div>
                  {award.issuer && (
                    <div
                      style={{
                        fontSize: "9pt",
                        color: "#e8f5e8",
                        marginBottom: "3px",
                      }}
                    >
                      {award.issuer}
                    </div>
                  )}
                  {award.date && (
                    <div
                      style={{
                        fontSize: "8pt",
                        color: "#c8e6c9",
                        marginBottom: "3px",
                      }}
                    >
                      {award.date}
                    </div>
                  )}
                  {award.description && (
                    <div style={{ fontSize: "9pt", lineHeight: "1.4" }}>
                      {award.description}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Declaration */}
          {declaration && declaration.description && (
            <Section title="DECLARATION" noHr={true}>
              <div
                style={{
                  fontSize: "9pt",
                  lineHeight: "1.4",
                  marginBottom: "10px",
                }}
              >
                {declaration.description}
              </div>
              {declaration.signature && (
                <div style={{ fontSize: "9pt", fontStyle: "italic" }}>
                  {declaration.signature}
                </div>
              )}
            </Section>
          )}
        </td>
      </tr>
    </table>
  );
};

export default ElegantTemplateWord;

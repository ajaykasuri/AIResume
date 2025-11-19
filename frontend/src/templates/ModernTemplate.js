// templates/ModernTemplateWord.jsx
import React from "react";

const ModernTemplateWord = ({ data = {} }) => {
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

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: "21px" }}>
      {title && (
        <div
          style={{
            fontWeight: "bold",
            fontSize: "11pt",
            color: "#232323",
            borderBottom: "1px solid #e1e1e1",
            marginBottom: "6px",
            paddingBottom: "2px",
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );

  return (
    <table
      width="100%"
      border="0"
      cellPadding="0"
      cellSpacing="0"
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: "12pt",
        borderCollapse: "collapse",
        backgroundColor: "#ffffff",
      }}
    >
      <tr>
        {/* Sidebar Column */}
        <td
          width="35%"
          valign="top"
          style={{
            backgroundColor: "#ffffff",
            color: "#161616",
            padding: "20px",
            verticalAlign: "top",
          }}
        >
          {/* Name and Title */}
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                color: "#161616",
                fontSize: "23pt",
                fontWeight: "bold",
                marginBottom: "3px",
              }}
            >
              {basics.name || "Your Name"}
            </div>
            <div
              style={{
                color: "#434343",
                fontSize: "13pt",
                marginBottom: "25px",
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
                      color: "black",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    ✉️
                  </td>
                  <td
                    style={{
                      color: "black",
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
                      color: "black",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    📞
                  </td>
                  <td
                    style={{
                      color: "black",
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
                      color: "black",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    📍
                  </td>
                  <td
                    style={{
                      color: "black",
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
                      color: "black",
                      padding: "0",
                      margin: "0",
                      verticalAlign: "top",
                    }}
                  >
                    🔗
                  </td>
                  <td
                    style={{
                      color: "black",
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
            <div style={{ marginBottom: "22px" }}>
              <div
                style={{
                  color: "#212121",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  borderBottom: "1px solid #e0e0e0",
                  marginBottom: "8px",
                  paddingBottom: "2px",
                }}
              >
                PROFILE
              </div>
              <div
                style={{
                  color: "#222222",
                  fontSize: "10pt",
                  lineHeight: "1.4",
                }}
              >
                {personalStatement}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div style={{ marginBottom: "22px" }}>
              <div
                style={{
                  color: "#212121",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  borderBottom: "1px solid #e0e0e0",
                  marginBottom: "8px",
                  paddingBottom: "2px",
                }}
              >
                LANGUAGES
              </div>
              <ul
                style={{
                  color: "#161616",
                  fontSize: "10pt",
                  paddingLeft: "15px",
                  margin: 0,
                }}
              >
                {languages.map((lang, i) => (
                  <li key={i} style={{ marginBottom: "5px" }}>
                    <b>{lang.name}</b> - {lang.proficiency}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div style={{ marginBottom: "22px" }}>
              <div
                style={{
                  color: "#212121",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  borderBottom: "1px solid #e0e0e0",
                  marginBottom: "8px",
                  paddingBottom: "2px",
                }}
              >
                EDUCATION
              </div>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#161616",
                      fontSize: "10pt",
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div style={{ color: "#161616", fontSize: "9pt" }}>
                    {edu.institution}
                  </div>
                  <div style={{ color: "#7d7d7d", fontSize: "9pt" }}>
                    {formatDate(edu.from)} –{" "}
                    {edu.current ? "Present" : formatDate(edu.to)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/*             borderBottom: "1px solid #e0e0e0", */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <div
                style={{
                  fontSize: "12pt",
                  fontWeight: "bold",
                  color: "#010701ff",
                  marginBottom: "12px",
                  borderBottom: "1px solid #e0e0e0",
                  paddingBottom: "4px",
                  paddingLeft: "20px",
                }}
              >
                SKILLS
              </div>
              <div
                style={{
                  fontSize: "10pt",
                  color: "#130101ff",
                  paddingLeft: "5px",
                }}
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

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div style={{ marginBottom: "22px" }}>
              <div
                style={{
                  color: "#212121",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  borderBottom: "1px solid #e0e0e0",
                  marginBottom: "8px",
                  paddingBottom: "2px",
                }}
              >
                CERTIFICATIONS
              </div>
              <ul
                style={{
                  color: "#161616",
                  fontSize: "10pt",
                  paddingLeft: "15px",
                  margin: 0,
                }}
              >
                {certifications.map((cert, i) => (
                  <li key={i} style={{ marginBottom: "5px" }}>
                    <b>{cert.name}</b> - {cert.issuer}
                    {cert.dateObtained && ` (${cert.dateObtained})`}
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
          style={{
            backgroundColor: "#ffffff",
            color: "#161616",
            padding: "20px",
            verticalAlign: "top",
          }}
        >
          {/* Experience */}
          {experience && experience.length > 0 && (
            <Section title="PROFESSIONAL EXPERIENCE">
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "3px",
                      color: "#161616",
                    }}
                  >
                    {exp.title}
                  </div>
                  <div
                    style={{
                      color: "#161616",
                      fontSize: "10pt",
                      marginBottom: "5px",
                    }}
                  >
                    {exp.employer}
                  </div>
                  <div
                    style={{
                      color: "#7d7d7d",
                      fontSize: "9pt",
                      marginBottom: "8px",
                    }}
                  >
                    {formatDate(exp.from)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.to)}
                  </div>
                  {exp.description && (
                    <div
                      style={{
                        fontSize: "10pt",
                        lineHeight: "1.4",
                        color: "#161616",
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
                <div key={i} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "5px",
                      color: "#161616",
                    }}
                  >
                    {proj.title}
                  </div>
                  {proj.link && (
                    <div
                      style={{
                        fontSize: "9pt",
                        marginBottom: "5px",
                        color: "#161616",
                      }}
                    >
                      <a href={proj.link} style={{ color: "#161616" }}>
                        {proj.link}
                      </a>
                    </div>
                  )}
                  {proj.description && (
                    <div
                      style={{
                        fontSize: "10pt",
                        lineHeight: "1.4",
                        color: "#161616",
                      }}
                    >
                      {proj.description}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <Section title="ACHIEVEMENTS">
              {achievements.map((achievement, i) => (
                <div key={i} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "3px",
                      color: "#161616",
                    }}
                  >
                    {achievement.title}
                  </div>
                  {achievement.date && (
                    <div
                      style={{
                        color: "#7d7d7d",
                        fontSize: "9pt",
                        marginBottom: "5px",
                      }}
                    >
                      {achievement.date}
                    </div>
                  )}
                  {achievement.description && (
                    <div
                      style={{
                        fontSize: "10pt",
                        lineHeight: "1.4",
                        color: "#161616",
                      }}
                    >
                      {achievement.description}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Declaration */}
          {declaration && declaration.description && (
            <Section title="DECLARATION">
              <div
                style={{
                  fontSize: "10pt",
                  lineHeight: "1.4",
                  color: "#161616",
                }}
              >
                {declaration.description}
              </div>
              {declaration.signature && (
                <div
                  style={{
                    textAlign: "right",
                    marginTop: "15px",
                    fontSize: "10pt",
                  }}
                >
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

export default ModernTemplateWord;

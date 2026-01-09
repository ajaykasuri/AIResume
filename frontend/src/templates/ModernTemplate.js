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

  const formatYear = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch (e) {
      return dateString;
    }
  };

  const hasContent = (section) => {
    if (Array.isArray(section)) {
      return (
        section.length > 0 &&
        section.some((item) =>
          Object.values(item).some(
            (value) => value && value.toString().trim() !== ""
          )
        )
      );
    }
    if (typeof section === "object" && section !== null) {
      return Object.values(section).some(
        (value) => value && value.toString().trim() !== ""
      );
    }
    return section && section.toString().trim() !== "";
  };

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: "25px" }}>
      {title && (
        <div
          style={{
            fontWeight: "bold",
            fontSize: "11pt",
            color: "#232323",
            borderBottom: "1px solid #e1e1e1",
            marginBottom: "10px",
            paddingBottom: "3px",
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );

  const SidebarSection = ({ title, children }) => (
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
        {title}
      </div>
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
        border: "none",
      }}
    >
      <tr>
        {/* Sidebar Column */}
        <td
          width="35%"
          valign="top"
          style={{
            backgroundColor: "#f8f9fa",
            color: "#161616",
            padding: "25px 20px",
            verticalAlign: "top",
            borderRight: "1px solid #e0e0e0",
            border: "none",
          }}
        >
          {/* Name and Title */}
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                color: "#161616",
                fontSize: "24pt",
                fontWeight: "bold",
                marginBottom: "5px",
                lineHeight: "1.1",
              }}
            >
              {basics.name || "Your Name"}
            </div>
            <div
              style={{
                color: "#434343",
                fontSize: "14pt",
                marginBottom: "25px",
                fontWeight: "600",
              }}
            >
              {basics.jobTitle || "Your Job Title"}
            </div>
          </div>

          {/* Contact Information */}
          <SidebarSection title="CONTACT INFORMATION">
            <div
              style={{ lineHeight: "1.6", fontSize: "10pt", color: "#161616" }}
            >
              {basics.email && (
                <div
                  style={{
                    marginBottom: "5px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ marginRight: "8px", minWidth: "20px" }}>
                    ✉️
                  </span>
                  <span>{basics.email}</span>
                </div>
              )}
              {basics.phone && (
                <div
                  style={{
                    marginBottom: "5px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ marginRight: "8px", minWidth: "20px" }}>
                    📞
                  </span>
                  <span>{basics.phone}</span>
                </div>
              )}
              {(basics.city || basics.country) && (
                <div
                  style={{
                    marginBottom: "5px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ marginRight: "8px", minWidth: "20px" }}>
                    📍
                  </span>
                  <span>
                    {basics.city}
                    {basics.city && basics.country ? ", " : ""}
                    {basics.country}
                  </span>
                </div>
              )}
              {basics.linkedIn && (
                <div
                  style={{
                    marginBottom: "5px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ marginRight: "8px", minWidth: "20px" }}>
                    🔗
                  </span>
                  <span>{basics.linkedIn}</span>
                </div>
              )}
              {basics.github && (
                <div
                  style={{
                    marginBottom: "5px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ marginRight: "8px", minWidth: "20px" }}>
                    🔗
                  </span>
                  <span>{basics.github}</span>
                </div>
              )}
              {basics.website && (
                <div
                  style={{
                    marginBottom: "5px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ marginRight: "8px", minWidth: "20px" }}>
                    🌐
                  </span>
                  <span>{basics.website}</span>
                </div>
              )}
            </div>
          </SidebarSection>

          {/* Profile */}
          {hasContent(personalStatement) && (
            <SidebarSection title="PROFILE">
              <div
                style={{
                  color: "#222222",
                  fontSize: "10pt",
                  lineHeight: "1.5",
                  textAlign: "justify",
                }}
              >
                {personalStatement}
              </div>
            </SidebarSection>
          )}

          {/* Skills */}
          {hasContent(skills) && (
            <SidebarSection title="SKILLS">
              <div style={{ fontSize: "10pt", color: "#161616" }}>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "6px",
                      paddingLeft: "15px",
                      textIndent: "-15px",
                      lineHeight: "1.4",
                    }}
                  >
                    • {skill}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Education */}
          {hasContent(education) && (
            <SidebarSection title="EDUCATION">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#161616",
                      fontSize: "10pt",
                      marginBottom: "3px",
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div
                    style={{
                      color: "#161616",
                      fontSize: "9pt",
                      marginBottom: "3px",
                    }}
                  >
                    {edu.institution}
                  </div>
                  <div
                    style={{
                      color: "#7d7d7d",
                      fontSize: "9pt",
                    }}
                  >
                    {formatYear(edu.from)} –{" "}
                    {edu.current ? "Present" : formatYear(edu.to)}
                  </div>
                </div>
              ))}
            </SidebarSection>
          )}

          {/* Languages */}
          {hasContent(languages) && (
            <SidebarSection title="LANGUAGES">
              <div style={{ color: "#161616", fontSize: "10pt" }}>
                {languages.map((lang, i) => (
                  <div key={i} style={{ marginBottom: "6px" }}>
                    <b>{lang.name}</b> - {lang.proficiency}
                    {lang.certificate && (
                      <div
                        style={{
                          fontSize: "9pt",
                          color: "#7d7d7d",
                          marginTop: "2px",
                        }}
                      >
                        {lang.certificate}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Certifications */}
          {hasContent(certifications) && (
            <SidebarSection title="CERTIFICATIONS">
              <div style={{ color: "#161616", fontSize: "10pt" }}>
                {certifications.map((cert, i) => (
                  <div key={i} style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "2px",
                      }}
                    >
                      {cert.name}
                    </div>
                    <div
                      style={{
                        color: "#7d7d7d",
                        marginBottom: "2px",
                      }}
                    >
                      {cert.issuer}
                      {cert.dateObtained &&
                        ` • ${formatDate(cert.dateObtained)}`}
                    </div>
                    {cert.credentialId && (
                      <div
                        style={{
                          fontSize: "9pt",
                          color: "#7d7d7d",
                        }}
                      >
                        ID: {cert.credentialId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Interests */}
          {hasContent(interests) && (
            <SidebarSection title="INTERESTS">
              <div style={{ color: "#161616", fontSize: "10pt" }}>
                {interests.map((interest, i) => (
                  <div key={i} style={{ marginBottom: "6px" }}>
                    <b>{interest.name}</b>
                    {interest.description && (
                      <div
                        style={{
                          color: "#7d7d7d",
                          marginTop: "2px",
                        }}
                      >
                        {interest.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
        </td>

        {/* Main Content Column */}
        <td
          width="65%"
          valign="top"
          style={{
            backgroundColor: "#ffffff",
            color: "#161616",
            padding: "25px 20px",
            verticalAlign: "top",
            border: "none",
          }}
        >
          {/* Experience */}
          {hasContent(experience) && (
            <Section title="PROFESSIONAL EXPERIENCE">
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: "22px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "4px",
                      color: "#161616",
                    }}
                  >
                    {exp.title}
                  </div>
                  <div
                    style={{
                      color: "#161616",
                      fontSize: "10pt",
                      marginBottom: "3px",
                    }}
                  >
                    {exp.employer}
                    {exp.location && `, ${exp.location}`}
                  </div>
                  <div
                    style={{
                      color: "#7d7d7d",
                      fontSize: "9pt",
                      marginBottom: "8px",
                      fontStyle: "italic",
                    }}
                  >
                    {formatDate(exp.from)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.to)}
                  </div>
                  {exp.description && (
                    <div
                      style={{
                        fontSize: "10pt",
                        lineHeight: "1.5",
                        color: "#161616",
                      }}
                    >
                      {exp.description.split("\n").map((line, idx) => (
                        <div key={idx} style={{ marginBottom: "4px" }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Projects */}
          {hasContent(projects) && (
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

                  {/* Project Details */}
                  <div style={{ marginBottom: "6px" }}>
                    {proj.link && (
                      <div
                        style={{
                          fontSize: "9pt",
                          marginBottom: "3px",
                          color: "#161616",
                        }}
                      >
                        <span
                          style={{
                            color: "#161616",
                          }}
                        >
                          {proj.link}
                        </span>
                      </div>
                    )}

                    {/* Project Period */}
                    <div
                      style={{
                        color: "#7d7d7d",
                        fontSize: "9pt",
                        marginBottom: "4px",
                        fontStyle: "italic",
                      }}
                    >
                      {formatDate(proj.from)} –{" "}
                      {proj.current ? "Present" : formatDate(proj.to)}
                    </div>

                    {/* Client and Team */}
                    {(proj.clientName || proj.teamSize) && (
                      <div
                        style={{
                          fontSize: "9pt",
                          color: "#7d7d7d",
                          marginBottom: "4px",
                        }}
                      >
                        {proj.clientName && `Client: ${proj.clientName}`}
                        {proj.clientName && proj.teamSize && " | "}
                        {proj.teamSize && `Team Size: ${proj.teamSize}`}
                      </div>
                    )}

                    {/* Skills Used */}
                    {proj.skillsUsed && proj.skillsUsed.length > 0 && (
                      <div
                        style={{
                          fontSize: "9pt",
                          color: "#7d7d7d",
                          marginBottom: "6px",
                        }}
                      >
                        <strong>Technologies:</strong>{" "}
                        {proj.skillsUsed.join(", ")}
                      </div>
                    )}
                  </div>

                  {/* Project Description */}
                  {proj.description && (
                    <div
                      style={{
                        fontSize: "10pt",
                        lineHeight: "1.5",
                        color: "#161616",
                      }}
                    >
                      {proj.description.split("\n").map((line, idx) => (
                        <div key={idx} style={{ marginBottom: "4px" }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Achievements */}
          {hasContent(achievements) && (
            <Section title="ACHIEVEMENTS">
              {achievements.map((achievement, i) => (
                <div key={i} style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "4px",
                      color: "#161616",
                    }}
                  >
                    {achievement.title}
                  </div>
                  <div
                    style={{
                      color: "#7d7d7d",
                      fontSize: "9pt",
                      marginBottom: "6px",
                    }}
                  >
                    {achievement.issuer}
                    {achievement.date && ` • ${formatDate(achievement.date)}`}
                    {achievement.category && ` • ${achievement.category}`}
                  </div>
                  {achievement.description && (
                    <div
                      style={{
                        fontSize: "10pt",
                        lineHeight: "1.5",
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

          {/* Awards */}
          {hasContent(awards) && (
            <Section title="AWARDS">
              {awards.map((award, i) => (
                <div key={i} style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "4px",
                      color: "#161616",
                    }}
                  >
                    {award.title}
                  </div>
                  <div
                    style={{
                      color: "#7d7d7d",
                      fontSize: "9pt",
                      marginBottom: "6px",
                    }}
                  >
                    {award.issuer}
                    {award.date && ` • ${formatDate(award.date)}`}
                  </div>
                  {award.description && (
                    <div
                      style={{
                        fontSize: "10pt",
                        lineHeight: "1.5",
                        color: "#161616",
                      }}
                    >
                      {award.description}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Declaration */}
          {hasContent(declaration) && (
            <Section title="DECLARATION">
              <div
                style={{
                  fontSize: "10pt",
                  lineHeight: "1.5",
                  color: "#161616",
                  textAlign: "justify",
                  marginBottom: "15px",
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
                    fontWeight: "bold",
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

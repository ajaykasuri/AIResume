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
 
  const formatYear = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch (e) {
      return dateString;
    }
  };
 
  // Check if section has content
  const hasContent = (section) => {
    if (Array.isArray(section)) {
      return section.length > 0 && section.some(item =>
        Object.values(item).some(value =>
          value && value.toString().trim() !== ''
        )
      );
    }
    if (typeof section === 'object' && section !== null) {
      return Object.values(section).some(value =>
        value && value.toString().trim() !== ''
      );
    }
    return section && section.toString().trim() !== '';
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
 
  const SidebarSection = ({ title, children, noHr }) => (
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
        {title}
      </div>
      {children}
      {!noHr && (
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e0e0e0",
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
        tableLayout: "fixed",
      }}
    >
      <tr>
        {/* Left Column */}
        <td
          width="35%"
          valign="top"
          style={{
            backgroundColor: "#ffffff",
            padding: "25px 20px",
            border: "none",
            verticalAlign: "top",
          }}
        >
          {/* Name and Title */}
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                fontSize: "22pt",
                fontWeight: "bold",
                color: "#000000",
                marginBottom: "8px",
                lineHeight: "1.1",
              }}
            >
              {basics.name || "Your Name"}
            </div>
            <div
              style={{
                fontSize: "13pt",
                color: "#2e7d32",
                fontWeight: "600",
                fontStyle: "italic",
              }}
            >
              {basics.jobTitle || "Your Job Title"}
            </div>
          </div>
 
          {/* Contact Information */}
          <SidebarSection>
            <div >
              {basics.email && (
                <div style={{ marginBottom: "8px", fontSize: "10pt", color: "#000000" }}>
                  {basics.email}
                </div>
              )}
              {basics.phone && (
                <div style={{ marginBottom: "8px", fontSize: "10pt", color: "#000000" }}>
                  {basics.phone}
                </div>
              )}
              {(basics.city || basics.country) && (
                <div style={{ marginBottom: "8px", fontSize: "10pt", color: "#000000" }}>
                  {basics.city}
                  {basics.city && basics.country ? ", " : ""}
                  {basics.country}
                </div>
              )}
              {basics.linkedIn && (
                <div style={{ marginBottom: "8px", fontSize: "10pt", color: "#000000" }}>
                  {basics.linkedIn}
                </div>
              )}
              {basics.github && (
                <div style={{ marginBottom: "8px", fontSize: "10pt", color: "#000000" }}>
                  {basics.github}
                </div>
              )}
              {basics.website && (
                <div style={{ marginBottom: "8px", fontSize: "10pt", color: "#000000" }}>
                  {basics.website}
                </div>
              )}
            </div>
          </SidebarSection>
 
          {/* Profile in Sidebar */}
          {hasContent(personalStatement) && (
            <SidebarSection title="PROFILE">
              <div
                style={{
                  fontSize: "9pt",
                  color: "#000000",
                  lineHeight: "1.5",
                  textAlign: "justify"
                }}
              >
                {personalStatement}
              </div>
            </SidebarSection>
          )}
 
          {/* Skills */}
          {hasContent(skills) && (
            <SidebarSection title="SKILLS">
              <div style={{ fontSize: "9pt", color: "#000000" }}>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "6px",
                      paddingLeft: "15px",
                      lineHeight: "1.3"
                    }}
                  >
                    • {skill}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
 
          {/* Languages */}
          {hasContent(languages) && (
            <SidebarSection title="LANGUAGES">
              <div style={{ fontSize: "9pt", color: "#000000" }}>
                {languages.map((lang, i) => (
                  <div key={i} style={{ marginBottom: "6px" }}>
                    <strong>{lang.name}</strong> - {lang.proficiency}
                    {lang.certificate && (
                      <div style={{ fontSize: "8pt", color: "#666666", marginTop: "2px" }}>
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
              <div style={{ fontSize: "9pt", color: "#000000" }}>
                {certifications.map((cert, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                      {cert.name}
                    </div>
                    <div style={{ color: "#666666", marginBottom: "2px" }}>
                      {cert.issuer}
                      {cert.dateObtained && ` • ${formatDate(cert.dateObtained)}`}
                    </div>
                    {cert.credentialId && (
                      <div style={{ fontSize: "8pt", color: "#666666" }}>
                        ID: {cert.credentialId}
                      </div>
                    )}
                    {cert.expirationDate && (
                      <div style={{ fontSize: "8pt", color: "#666666" }}>
                        Expires: {formatDate(cert.expirationDate)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
 
          {/* Interests */}
          {hasContent(interests) && (
            <SidebarSection title="INTERESTS" noHr={true}>
              <div style={{ fontSize: "9pt", color: "#000000" }}>
                {interests.map((interest, i) => (
                  <div key={i} style={{ marginBottom: "6px" }}>
                    <strong>{interest.name}</strong>
                    {interest.description && (
                      <div style={{ color: "#666666", marginTop: "2px" }}>
                        {interest.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
        </td>
 
        {/* Right Column */}
        <td
          width="65%"
          valign="top"
          style={{
            backgroundColor: "#2e7d32",
            color: "#ffffff",
            padding: "25px 20px",
            border: "none",
            verticalAlign: "top",
          }}
        >
          {/* Experience */}
          {hasContent(experience) && (
            <Section title="PROFESSIONAL EXPERIENCE">
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "4px",
                      color: "#ffffff",
                    }}
                  >
                    {exp.title}
                  </div>
                  <div
                    style={{
                      fontSize: "10pt",
                      color: "#e8f5e8",
                      marginBottom: "3px",
                    }}
                  >
                    {exp.employer}
                    {exp.location ? `, ${exp.location}` : ""}
                  </div>
                  <div
                    style={{
                      fontSize: "9pt",
                      color: "#c8e6c9",
                      marginBottom: "8px",
                      fontStyle: "italic",
                    }}
                  >
                    {formatDate(exp.from)} – {exp.current ? "Present" : formatDate(exp.to)}
                  </div>
                  {exp.description && (
                    <div
                      style={{
                        fontSize: "10pt",
                        lineHeight: "1.5",
                        marginBottom: "10px",
                        color: "#ffffff",
                      }}
                    >
                      {exp.description.split('\n').map((line, idx) => (
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
                <div key={i} style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "4px",
                      color: "#ffffff",
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
                          color: "#e8f5e8",
                          marginBottom: "2px",
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
                   
                    {/* Project Period */}
                    <div
                      style={{
                        fontSize: "9pt",
                        color: "#c8e6c9",
                        marginBottom: "4px",
                        fontStyle: "italic",
                      }}
                    >
                      {formatDate(proj.from)} – {proj.current ? "Present" : formatDate(proj.to)}
                    </div>
 
                    {/* Client and Team */}
                    {(proj.clientName || proj.teamSize) && (
                      <div
                        style={{
                          fontSize: "9pt",
                          color: "#e8f5e8",
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
                          color: "#c8e6c9",
                          marginBottom: "6px",
                        }}
                      >
                        <strong>Technologies:</strong> {proj.skillsUsed.join(", ")}
                      </div>
                    )}
                  </div>
 
                  {/* Project Description */}
                  {proj.description && (
                    <div
                      style={{
                        fontSize: "10pt",
                        lineHeight: "1.5",
                        color: "#ffffff",
                      }}
                    >
                      {proj.description.split('\n').map((line, idx) => (
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
 
          {/* Education */}
          {hasContent(education) && (
            <Section title="EDUCATION">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: "18px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "4px",
                      color: "#ffffff",
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div
                    style={{
                      fontSize: "10pt",
                      color: "#e8f5e8",
                      marginBottom: "3px",
                    }}
                  >
                    {edu.institution}
                  </div>
                  <div
                    style={{
                      fontSize: "9pt",
                      color: "#c8e6c9",
                      fontStyle: "italic"
                    }}
                  >
                    {formatYear(edu.from)} – {edu.current ? "Present" : formatYear(edu.to)}
                  </div>
                </div>
              ))}
            </Section>
          )}
 
          {/* Achievements */}
          {hasContent(achievements) && (
            <Section title="ACHIEVEMENTS">
              {achievements.map((achievement, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "4px",
                      color: "#ffffff",
                    }}
                  >
                    {achievement.title}
                  </div>
                  <div
                    style={{
                      fontSize: "9pt",
                      color: "#e8f5e8",
                      marginBottom: "4px",
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
                        color: "#ffffff"
                      }}
                    >
                      {achievement.description}
                    </div>
                  )}
                  {achievement.link && (
                    <div style={{
                      fontSize: "9pt",
                      marginTop: "4px",
                    }}>
                      <a href={achievement.link} style={{
                        color: "#e8f5e8",
                        textDecoration: "underline",
                      }}>
                        {achievement.link}
                      </a>
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
                <div key={i} style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      marginBottom: "4px",
                      color: "#ffffff",
                    }}
                  >
                    {award.title}
                  </div>
                  <div
                    style={{
                      fontSize: "9pt",
                      color: "#e8f5e8",
                      marginBottom: "4px",
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
                        color: "#ffffff"
                      }}
                    >
                      {award.description}
                    </div>
                  )}
                  {award.link && (
                    <div style={{
                      fontSize: "9pt",
                      marginTop: "4px",
                    }}>
                      <a href={award.link} style={{
                        color: "#e8f5e8",
                        textDecoration: "underline",
                      }}>
                        {award.link}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}
 
          {/* Declaration */}
          {hasContent(declaration) && (
            <Section title="DECLARATION" noHr={true}>
              <div
                style={{
                  fontSize: "10pt",
                  lineHeight: "1.5",
                  marginBottom: "15px",
                  color: "#ffffff",
                  textAlign: "justify",
                }}
              >
                {declaration.description}
              </div>
              {declaration.signature && (
                <div
                  style={{
                    fontSize: "10pt",
                    fontStyle: "italic",
                    textAlign: "right",
                    color: "#e8f5e8"
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
 
export default ElegantTemplateWord;
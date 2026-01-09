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

  const SidebarSection = ({ title, children }) => (
    <div style={{ marginBottom: "20px" }}>
      <h3
        style={{
          color: "#96ddbf",
          fontSize: "11pt",
          margin: "0 0 8px 0",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          borderBottom: "1px solid rgba(150, 221, 191, 0.5)", 
          paddingBottom: "5px", 
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );

  const MainSection = ({ title, children }) => (
    <div style={{ 
      marginBottom: "20px",
      borderBottom: "1px solid #e0e0e0", 
      paddingBottom: "15px",
    }}>
      <h3
        style={{
          color: "#335d46",
          fontSize: "11pt",
          margin: "0 0 12px 0",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          borderBottom: "1px solid #335d46",  
          paddingBottom: "5px",   
        }}
      >
        {title}
      </h3>
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
        fontFamily: "Georgia, serif",
        fontSize: "12pt",
        borderCollapse: "collapse",
        tableLayout: "fixed",
        border: "1px solid #295040", // Added outer border
      }}
    >
      <tr>
        {/* Sidebar Column - 35% width */}
        <td
          width="35%"
          valign="top"
          style={{
            backgroundColor: "#295040",
            color: "white",
            padding: "25px 20px",
            border: "none",
            verticalAlign: "top",
            borderRight: "2px solid #96ddbf", // Added vertical divider
          }}
        >
          {/* Name and Title */}
          <div style={{ 
            marginBottom: "25px",
            borderBottom: "2px solid #96ddbf",  
            paddingBottom: "15px",   
          }}>
            <h1 style={{
              color: "white",
              fontSize: "22pt",
              margin: "0 0 8px 0",
              fontWeight: "bold",
              lineHeight: "1.1",
            }}>
              {basics.name || "Your Name"}
            </h1>
            <div style={{
              color: "#efeeef",
              fontSize: "13pt",
              fontStyle: "italic",
              marginBottom: "10px",
              fontWeight: "600",
            }}>
              {basics.jobTitle || "Your Job Title"}
            </div>
          </div>

          {/* Contact Information */}
          <SidebarSection title="CONTACT INFORMATION">
            <div style={{ lineHeight: "1.6" }}>
              {basics.email && (
                <div       >
                       
                  <div style={{ fontSize: "10pt", color: "#ddeade" }}>{basics.email}</div>
                </div>
              )}
              {basics.phone && (
                <div       >
                  <div style={{ fontSize: "10pt", color: "#ddeade" }}>{basics.phone}</div>
                </div>
              )}
              {(basics.city || basics.country) && (
                <div       >
                  <div style={{ fontSize: "10pt", color: "#ddeade" }}>
                    {basics.city}
                    {basics.city && basics.country ? ", " : ""}
                    {basics.country}
                  </div>
                </div>
              )}
              {basics.linkedIn && (
                <div       >
                  <div style={{ fontSize: "10pt", color: "#ddeade" }}>{basics.linkedIn}</div>
                </div>
              )}
              {basics.github && (
                <div>
                
                  <div style={{ fontSize: "10pt", color: "#ddeade" }}>{basics.github}</div>
                </div>
              )}
              {basics.website && (
                <div       >
                  <div style={{ fontSize: "10pt", color: "#ddeade" }}>{basics.website}</div>
                </div>
              )}
            </div>
          </SidebarSection>

          {/* Profile */}
          {hasContent(personalStatement) && (
            <SidebarSection title="PROFILE">
              <div style={{
                color: "#ddeade",
                fontSize: "10pt",
                lineHeight: "1.5",
                textAlign: "justify",
                border: "1px solid rgba(150, 221, 191, 0.3)",  
                padding: "10px",   
                borderRadius: "4px",  
              }}>
                {personalStatement}
              </div>
            </SidebarSection>
          )}

          {/* Skills */}
          {hasContent(skills) && (
            <SidebarSection title="SKILLS">
              <div style={{ fontSize: "10pt", color: "#ddeade" }}>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "4px",
                      lineHeight: "1.4",
                      borderBottom: "1px dashed rgba(255, 255, 255, 0.1)",  
                      paddingBottom: "4px",
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
              {education.map((edu, index) => (
                <div key={index} style={{ 
                  marginBottom: "12px",
                  borderLeft: "2px solid #96ddbf",  
                  paddingLeft: "10px",   
                }}>
                  <div style={{
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "10pt",
                    marginBottom: "2px",
                  }}>
                    {edu.institution}
                  </div>
                  <div style={{
                    color: "#cfe1d7",
                    fontSize: "9pt",
                    fontStyle: "italic",
                    marginBottom: "2px",
                  }}>
                    {edu.degree}
                  </div>
                  <div style={{ 
                    color: "#b6d2c5", 
                    fontSize: "9pt",
                    border: "1px solid rgba(182, 210, 197, 0.3)",  
                    padding: "2px 6px",   
                    display: "inline-block",
                  }}>
                    {formatYear(edu.from)} -{" "}
                    {edu.current ? "Present" : formatYear(edu.to)}
                  </div>
                </div>
              ))}
            </SidebarSection>
          )}

          {/* Languages */}
          {hasContent(languages) && (
            <SidebarSection title="LANGUAGES">
              <div style={{ color: "#ddeade", fontSize: "10pt" }}>
                {languages.map((lang, index) => (
                  <div key={index} style={{ 
                    marginBottom: "4px",
                    borderBottom: "1px dashed rgba(255, 255, 255, 0.1)",  
                    paddingBottom: "4px",
                  }}>
                    <strong>{lang.name}</strong>
                    {lang.proficiency && ` - ${lang.proficiency}`}
                    {lang.certificate && (
                      <div style={{
                        fontSize: "9pt",
                        color: "#b6d2c5",
                        marginTop: "1px",
                        borderTop: "1px dashed rgba(182, 210, 197, 0.2)",  
                        paddingTop: "2px",
                      }}>
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
              <div style={{ color: "#ddeade", fontSize: "10pt" }}>
                {certifications.map((cert, index) => (
                  <div key={index} style={{ 
                    marginBottom: "10px",
                    borderBottom: "1px dashed rgba(255, 255, 255, 0.1)",  
                    paddingBottom: "10px",
                  }}>
                    <div style={{
                      fontWeight: "bold",
                      marginBottom: "2px",
                    }}>
                      {cert.name}
                    </div>
                    <div style={{
                      color: "#cfe1d7",
                      marginBottom: "2px",
                    }}>
                      {cert.issuer}
                      {cert.dateObtained && ` • ${formatDate(cert.dateObtained)}`}
                    </div>
                    {cert.credentialId && (
                      <div style={{
                        fontSize: "9pt",
                        color: "#b6d2c5",
                        border: "1px dashed rgba(182, 210, 197, 0.3)",  
                        padding: "2px 4px",   
                        display: "inline-block",
                      }}>
                        ID: {cert.credentialId}
                      </div>
                    )}
                    {cert.expirationDate && (
                      <div style={{
                        fontSize: "9pt",
                        color: "#b6d2c5",
                      }}>
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
            <SidebarSection title="INTERESTS">
              <div style={{ color: "#ddeade", fontSize: "10pt" }}>
                {interests.map((interest, index) => (
                  <div key={index} style={{ 
                    marginBottom: "4px",
                    border: "1px solid rgba(150, 221, 191, 0.3)",  
                    padding: "4px 8px",   
                    display: "inline-block",
                    marginRight: "5px",
                    borderRadius: "4px",  
                  }}>
                    <strong>{interest.name}</strong>
                    {interest.description && (
                      <div style={{
                        color: "#cfe1d7",
                        marginTop: "1px",
                      }}>
                        {interest.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
        </td>

        {/* Main Content Column - 65% width */}
        <td
          width="65%"
          valign="top"
          style={{
            backgroundColor: "white",
            color: "#333333",
            padding: "25px 20px",
            border: "none",
            verticalAlign: "top",
          }}
        >
          {/* Professional Experience */}
          {hasContent(experience) && (
            <MainSection title="PROFESSIONAL EXPERIENCE">
              {experience.map((exp, index) => (
                <div key={index} style={{ 
                  marginBottom: "18px",
                  borderLeft: "3px solid #295040", 
                  paddingLeft: "12px", 
                }}>
                  <div style={{
                    fontWeight: "bold",
                    fontSize: "11pt",
                    marginBottom: "3px",
                    color: "#295040",
                  }}>
                    {exp.title}
                    {exp.employer && ` — ${exp.employer}`}
                  </div>
                  <div style={{
                    color: "#495659",
                    fontSize: "9pt",
                    marginBottom: "6px",
                    fontStyle: "italic",
                         
                    paddingBottom: "4px", 
                  }}>
                    {formatDate(exp.from)} -{" "}
                    {exp.current ? "Present" : formatDate(exp.to)}
                    {exp.location && ` • ${exp.location}`}
                  </div>
                  {exp.description && (
                    <div style={{
                      fontSize: "10pt",
                      lineHeight: "1.5",
                      color: "#333333",
                    }}>
                      {exp.description.split('\n').map((line, idx) => (
                        <div key={idx} style={{ 
                          marginBottom: "3px",
                          borderLeft: "1px solid #e0e0e0", 
                          paddingLeft: "8px", 
                        }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </MainSection>
          )}

          {/* Projects */}
          {hasContent(projects) && (
            <MainSection title="PROJECTS">
              {projects.map((proj, index) => (
                <div key={index} style={{ 
                  marginBottom: "16px",
                    
                  padding: "12px",
                  borderRadius: "4px", 
                }}>
                  <div style={{
                    fontWeight: "bold",
                    fontSize: "11pt",
                    marginBottom: "4px",
                    color: "#295040",
                  }}>
                    {proj.title}
                  </div>
                  
                  {/* Project Details */}
                  <div style={{ marginBottom: "6px" }}>
                    {proj.link && (
                      <div style={{
                        fontSize: "9pt",
                        marginBottom: "2px",
                            
                        paddingBottom: "4px", 
                      }}>
                        <a href={proj.link} style={{
                          color: "#295040",
                          textDecoration: "underline",
                        }}>
                          {proj.link}
                        </a>
                      </div>
                    )}
                   
                    {/* Project Period */}
                    <div style={{
                      fontSize: "9pt",
                      color: "#495659",
                      marginBottom: "3px",
                      fontStyle: "italic",
                           
                      padding: "2px 6px", 
                      display: "inline-block",
                    }}>
                      {formatDate(proj.from)} -{" "}
                      {proj.current ? "Present" : formatDate(proj.to)}
                    </div>

                    {/* Client and Team */}
                    {(proj.clientName || proj.teamSize) && (
                      <div style={{
                        fontSize: "9pt",
                        color: "#495659",
                        marginBottom: "3px",
                       
                    
                      }}>
                        {proj.clientName && `Client: ${proj.clientName}`}
                        {proj.clientName && proj.teamSize && " | "}
                        {proj.teamSize && `Team Size: ${proj.teamSize}`}
                      </div>
                    )}

                    {/* Skills Used */}
                    {proj.skillsUsed && proj.skillsUsed.length > 0 && (
                      <div style={{
                        fontSize: "9pt",
                        color: "#495659",
                        marginBottom: "4px",
                              
                        padding: "4px 8px",   
                        borderRadius: "4px",  
                      }}>
                        <strong>Technologies:</strong> {proj.skillsUsed.join(", ")}
                      </div>
                    )}
                  </div>

                  {/* Project Description */}
                  {proj.description && (
                    <div style={{
                      fontSize: "10pt",
                      lineHeight: "1.5",
                      color: "#333333",
                      borderTop: "1px solid #e0e0e0",  
                      paddingTop: "8px",   
                    }}>
                      {proj.description.split('\n').map((line, idx) => (
                        <div key={idx} style={{ marginBottom: "3px" }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </MainSection>
          )}

          {/* Achievements */}
          {hasContent(achievements) && (
            <MainSection title="ACHIEVEMENTS">
              {achievements.map((achievement, index) => (
                <div key={index} style={{ 
                  marginBottom: "14px",
                        
                  padding: "10px",   
                  borderRadius: "4px",  
                }}>
                  <div style={{
                    fontWeight: "bold",
                    fontSize: "10pt",
                    color: "#295040",
                    marginBottom: "3px",
                  }}>
                    {achievement.title}
                  </div>
                  <div style={{
                    fontSize: "9pt",
                    color: "#495659",
                    marginBottom: "3px",
                          
                    paddingBottom: "3px",   
                  }}>
                    {achievement.issuer}
                    {achievement.date && ` • ${formatDate(achievement.date)}`}
                    {achievement.category && ` • ${achievement.category}`}
                  </div>
                  {achievement.description && (
                    <div style={{
                      fontSize: "10pt",
                      lineHeight: "1.5",
                      color: "#333333",
                    }}>
                      {achievement.description}
                    </div>
                  )}
                  {achievement.link && (
                    <div style={{
                      fontSize: "9pt",
                      marginTop: "2px",
                 
                    }}>
                      <a href={achievement.link} style={{
                        color: "#295040",
                        textDecoration: "underline",
                      }}>
                        {achievement.link}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </MainSection>
          )}

          {/* Awards */}
          {hasContent(awards) && (
            <MainSection title="AWARDS">
              {awards.map((award, index) => (
                <div key={index} style={{ 
                  marginBottom: "14px",
                     
                  padding: "12px",   
                  borderRadius: "4px",  
                  backgroundColor: "#f9f9f9", // Light background
                }}>
                  <div style={{
                    fontWeight: "bold",
                    fontSize: "10pt",
                    color: "#295040",
                    marginBottom: "3px",
                  }}>
                    {award.title}
                  </div>
                  <div style={{
                    fontSize: "9pt",
                    color: "#495659",
                    marginBottom: "3px",
                    borderBottom: "1px solid #e0e0e0",  
                    paddingBottom: "3px",   
                  }}>
                    {award.issuer}
                    {award.date && ` • ${formatDate(award.date)}`}
                  </div>
                  {award.description && (
                    <div style={{
                      fontSize: "10pt",
                      lineHeight: "1.5",
                      color: "#333333",
                    }}>
                      {award.description}
                    </div>
                  )}
                  {award.link && (
                    <div style={{
                      fontSize: "9pt",
                      marginTop: "2px",
                    }}>
                      <a href={award.link} style={{
                        color: "#295040",
                        textDecoration: "underline",
                      }}>
                        {award.link}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </MainSection>
          )}

          {/* Certifications (also in main content if needed) */}
          {hasContent(certifications) && certifications.length > 0 && (
            <MainSection title="CERTIFICATIONS">
              {certifications.map((cert, index) => (
                <div key={index} style={{ 
                  marginBottom: "12px",
                  borderLeft: "3px solid #295040",  
                  paddingLeft: "10px",   
                }}>
                  <div style={{
                    fontWeight: "bold",
                    fontSize: "10pt",
                    color: "#295040",
                    marginBottom: "2px",
                  }}>
                    {cert.name}
                  </div>
                  <div style={{
                    fontSize: "9pt",
                    color: "#495659",
                    marginBottom: "2px",
                  }}>
                    {cert.issuer}
                    {cert.dateObtained && ` • ${formatDate(cert.dateObtained)}`}
                  </div>
                  {cert.credentialId && (
                    <div style={{
                      fontSize: "9pt",
                      color: "#495659",
                      
                      display: "inline-block",
                    }}>
                      Credential ID: {cert.credentialId}
                    </div>
                  )}
                  {cert.expirationDate && (
                    <div style={{
                      fontSize: "9pt",
                      color: "#495659",
                  
                      display: "inline-block",
                      marginLeft: "5px",
                    }}>
                      Expires: {formatDate(cert.expirationDate)}
                    </div>
                  )}
                </div>
              ))}
            </MainSection>
          )}

          {/* Declaration */}
          {hasContent(declaration) && (
            <MainSection title="DECLARATION">
              <div style={{
                fontSize: "10pt",
                lineHeight: "1.5",
                color: "#333333",
                textAlign: "justify",
                marginBottom: "12px",
                   
                padding: "15px",   
                borderRadius: "4px",  
              }}>
                {declaration.description}
              </div>
              {declaration.signature && (
                <div style={{
                  marginTop: "12px",
                  textAlign: "right",
                  fontSize: "10pt",
                  fontWeight: "bold",
                  color: "#295040",
                  borderTop: "1px solid #e0e0e0", 
                  paddingTop: "12px", 
                }}>
                  {declaration.signature}
                </div>
              )}
            </MainSection>
          )}
        </td>
      </tr>
    </table>
  );
};

export default ExecutiveTemplateWord;
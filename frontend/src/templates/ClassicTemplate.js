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
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatYear = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch (error) {
      return dateString;
    }
  };

  // Check if any section has content
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

        {/* Job Title */}
        {basics.jobTitle && (
          <div
            style={{
              fontSize: "14pt",
              color: "#444444",
              marginBottom: "15px",
              fontWeight: "600",
            }}
          >
            {basics.jobTitle}
          </div>
        )}

        {/* Contact Information */}
        <div
          style={{
            fontFamily: "Segoe UI, Arial, sans-serif",
            fontSize: "10pt",
            color: "#555555",
            marginBottom: "15px",
            lineHeight: "1.6",
          }}
        >
          {/* Email */}
          {basics.email && (
            <span style={{ margin: "0 8px" }}>{basics.email}</span>
          )}

          {/* Phone */}
          {basics.phone && (
            <span style={{ margin: "0 8px" }}>{basics.phone}</span>
          )}

          {/* Location */}
          {(basics.city || basics.country) && (
            <span style={{ margin: "0 8px" }}>
              {basics.city}
              {basics.city && basics.country ? ", " : ""}
              {basics.country}
            </span>
          )}

          {/* LinkedIn */}
          {basics.linkedIn && (
            <span style={{ margin: "0 8px" }}>{basics.linkedIn}</span>
          )}

          {/* GitHub */}
          {basics.github && (
            <span style={{ margin: "0 8px" }}>{basics.github}</span>
          )}

          {/* Website */}
          {basics.website && (
            <span style={{ margin: "0 8px" }}>{basics.website}</span>
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

      {/* Personal Statement / Summary */}
      {hasContent(personalStatement) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "8px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              PROFESSIONAL SUMMARY
            </div>
            <div
              style={{
                color: "#222222",
                fontSize: "11pt",
                lineHeight: "1.5",
                textAlign: "justify",
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

      {/* Skills */}
      {hasContent(skills) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "8px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              TECHNICAL SKILLS
            </div>
            <div
              style={{
                color: "#222222",
                fontSize: "11pt",
                lineHeight: "1.4",
              }}
            >
              {skills.join(", ")}
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

      {/* Work Experience */}
      {hasContent(experience) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "12px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              WORK EXPERIENCE
            </div>
            {experience.map((exp, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "16px",
                  padding: "8px 0",
                }}
              >
                {/* Job Title and Date */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      color: "#222222",
                    }}
                  >
                    {exp.title}
                  </span>
                  <span style={{ fontSize: "10pt", color: "#444444" }}>
                    {formatDate(exp.from)} –{" "}
                    {exp.current ? "Present" : formatDate(exp.to)}
                  </span>
                </div>

                {/* Employer and Location */}
                <div
                  style={{
                    fontSize: "10pt",
                    color: "#666666",
                    marginBottom: "6px",
                  }}
                >
                  {exp.employer}
                  {exp.location ? `, ${exp.location}` : ""}
                </div>

                {/* Description */}
                {exp.description && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.4",
                      color: "#222222",
                      marginTop: "6px",
                    }}
                  >
                    {exp.description.split("\n").map((line, i) => (
                      <div key={i} style={{ marginBottom: "4px" }}>
                        {line}
                      </div>
                    ))}
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
      {hasContent(projects) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "12px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              PROJECTS
            </div>
            {projects.map((proj, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "16px",
                  padding: "8px 0",
                }}
              >
                {/* Project Title and Date */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      color: "#222222",
                    }}
                  >
                    {proj.title}
                  </span>
                  <span style={{ fontSize: "10pt", color: "#444444" }}>
                    {formatDate(proj.from)} –{" "}
                    {proj.current ? "Present" : formatDate(proj.to)}
                  </span>
                </div>

                {/* Project Link */}
                {proj.link && (
                  <div
                    style={{
                      fontSize: "10pt",
                      color: "#666666",
                      marginBottom: "6px",
                    }}
                  >
                    <a
                      href={proj.link}
                      style={{ color: "#222222", textDecoration: "underline" }}
                    >
                      {proj.link}
                    </a>
                  </div>
                )}

                {/* Client and Team Size */}
                {(proj.clientName || proj.teamSize) && (
                  <div
                    style={{
                      fontSize: "10pt",
                      color: "#666666",
                      marginBottom: "6px",
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
                      fontSize: "10pt",
                      color: "#666666",
                      marginBottom: "6px",
                    }}
                  >
                    <strong>Technologies:</strong> {proj.skillsUsed.join(", ")}
                  </div>
                )}

                {/* Description */}
                {proj.description && (
                  <div
                    style={{
                      fontSize: "11pt",
                      lineHeight: "1.4",
                      color: "#222222",
                      marginTop: "6px",
                    }}
                  >
                    {proj.description.split("\n").map((line, i) => (
                      <div key={i} style={{ marginBottom: "4px" }}>
                        {line}
                      </div>
                    ))}
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

      {/* Education */}
      {hasContent(education) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "12px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              EDUCATION
            </div>
            {education.map((edu, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "12px",
                  padding: "6px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "11pt",
                      color: "#222222",
                    }}
                  >
                    {edu.degree}
                  </span>
                  <span style={{ fontSize: "10pt", color: "#444444" }}>
                    {formatYear(edu.from)} –{" "}
                    {edu.current ? "Present" : formatYear(edu.to)}
                  </span>
                </div>
                <div style={{ fontSize: "10pt", color: "#666666" }}>
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

      {/* Certifications */}
      {hasContent(certifications) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "12px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              CERTIFICATIONS
            </div>
            {certifications.map((cert, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "12px",
                  padding: "6px 0",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "11pt",
                    color: "#222222",
                    marginBottom: "2px",
                  }}
                >
                  {cert.name}
                </div>
                <div
                  style={{
                    fontSize: "10pt",
                    color: "#666666",
                    marginBottom: "2px",
                  }}
                >
                  {cert.issuer}
                  {cert.dateObtained && ` • ${formatDate(cert.dateObtained)}`}
                </div>
                {cert.credentialId && (
                  <div style={{ fontSize: "10pt", color: "#666666" }}>
                    Credential ID: {cert.credentialId}
                  </div>
                )}
                {cert.link && (
                  <div style={{ fontSize: "10pt", color: "#222222" }}>
                    <a
                      href={cert.link}
                      style={{ color: "#222222", textDecoration: "underline" }}
                    >
                      {cert.link}
                    </a>
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

      {/* Achievements */}
      {hasContent(achievements) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "12px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              ACHIEVEMENTS
            </div>
            {achievements.map((ach, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "12px",
                  padding: "6px 0",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "11pt",
                    color: "#222222",
                    marginBottom: "2px",
                  }}
                >
                  {ach.title}
                </div>
                <div
                  style={{
                    fontSize: "10pt",
                    color: "#666666",
                    marginBottom: "4px",
                  }}
                >
                  {ach.issuer}
                  {ach.date && ` • ${formatDate(ach.date)}`}
                  {ach.category && ` • ${ach.category}`}
                </div>
                {ach.description && (
                  <div
                    style={{
                      fontSize: "11pt",
                      color: "#222222",
                      lineHeight: "1.4",
                    }}
                  >
                    {ach.description}
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

      {/* Awards */}
      {hasContent(awards) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "12px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              AWARDS
            </div>
            {awards.map((award, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "12px",
                  padding: "6px 0",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "11pt",
                    color: "#222222",
                    marginBottom: "2px",
                  }}
                >
                  {award.title}
                </div>
                <div
                  style={{
                    fontSize: "10pt",
                    color: "#666666",
                    marginBottom: "4px",
                  }}
                >
                  {award.issuer}
                  {award.date && ` • ${formatDate(award.date)}`}
                </div>
                {award.description && (
                  <div
                    style={{
                      fontSize: "11pt",
                      color: "#222222",
                      lineHeight: "1.4",
                    }}
                  >
                    {award.description}
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

      {/* Languages */}
      {hasContent(languages) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "12px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              LANGUAGES
            </div>
            {languages.map((lang, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "8px",
                  padding: "4px 0",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "11pt",
                    color: "#222222",
                  }}
                >
                  {lang.name}:
                </span>
                <span
                  style={{
                    fontSize: "11pt",
                    color: "#222222",
                    marginLeft: "8px",
                  }}
                >
                  {lang.proficiency}
                </span>
                {lang.certificate && (
                  <div
                    style={{
                      fontSize: "10pt",
                      color: "#666666",
                      marginTop: "2px",
                    }}
                  >
                    Certificate: {lang.certificate}
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

      {/* Interests */}
      {hasContent(interests) && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontWeight: "600",
                fontSize: "13pt",
                letterSpacing: "0.8px",
                marginBottom: "12px",
                marginTop: "20px",
                color: "#222222",
                borderBottom: "1px solid #cccccc",
                paddingBottom: "4px",
              }}
            >
              INTERESTS
            </div>
            <div
              style={{ fontSize: "11pt", color: "#222222", lineHeight: "1.4" }}
            >
              {interests.map((interest, i) => (
                <div key={i} style={{ marginBottom: "6px" }}>
                  <strong>{interest.name}:</strong> {interest.description}
                </div>
              ))}
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

      {/* Declaration */}
      {hasContent(declaration) && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontWeight: "600",
              fontSize: "13pt",
              letterSpacing: "0.8px",
              marginBottom: "8px",
              marginTop: "20px",
              color: "#222222",
              borderBottom: "1px solid #cccccc",
              paddingBottom: "4px",
            }}
          >
            DECLARATION
          </div>
          <div
            style={{
              fontSize: "11pt",
              lineHeight: "1.5",
              color: "#222222",
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
                marginTop: "20px",
                fontSize: "11pt",
                fontWeight: "bold",
              }}
            >
              {declaration.signature}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassicTemplateWord;

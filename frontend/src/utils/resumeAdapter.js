export const adaptResumeData = (raw = {}) => {
  // 🔥 Normalize input FIRST
  const source = raw.data ?? raw;

  console.log("Adapting resume data:", source);

  const {
    basics = {},
    contact = [],
    experience = [],
    education = [],
    projects = [],
    skills = [],
    languages = [],
    certifications = [],
    achievements = [],
    awards = [],
    interests = [],
    declaration = {},
    personal_statement,
    personalStatement,
  } = source;

  const primaryContact = contact?.[0] ?? {};

  return {
    // ================= HEADER =================
    basics: {
      name:
        basics.name ||
        primaryContact.full_name ||
        "",

      email:
        basics.email ||
        primaryContact.email ||
        "",

      phone:
        basics.phone ||
        primaryContact.phone ||
        "",

      city:
        basics.city ||
        primaryContact.city ||
        "",

      country:
        basics.country ||
        primaryContact.country ||
        "",

      linkedIn:
        basics.linkedIn ||
        primaryContact.linkedin ||
        "",

      github:
        basics.github ||
        primaryContact.github ||
        "",

      website:
        basics.website ||
        primaryContact.website ||
        "",
    },

    // ================= SUMMARY =================
    personalStatement:
      personal_statement?.statement ||
      personalStatement ||
      "",

    // ================= EXPERIENCE =================
    experience: experience.map((exp) => ({
      title: exp.title || exp.role || "",
      employer: exp.employer || exp.company || "",
      location: exp.location || "",
      from: exp.from || exp.start_date || "",
      to: exp.to || exp.end_date || "",
      current: Boolean(exp.current),
      description: exp.description || "",
    })),

    // ================= EDUCATION =================
    education: education.map((edu) => ({
      degree: edu.degree || "",
      institution: edu.institution || "",
      from: edu.from || edu.start_year || "",
      to: edu.to || edu.end_year || "",
      current: Boolean(edu.current),
    })),

    // ================= PROJECTS =================
    projects: projects.map((proj) => ({
      title: proj.title || proj.project_name || "",
      role: proj.role || "",
      technologies:
        proj.skillsUsed ||
        (proj.technologies
          ? proj.technologies.split(",").map(t => t.trim())
          : []),
      description: proj.description || "",
      link: proj.link || "",
      from: proj.from || "",
      to: proj.to || "",
      current: Boolean(proj.current),
    })),

    // ================= SKILLS =================
    skills: skills.map((s) =>
      typeof s === "string"
        ? s
        : s.skill_name || s.name || ""
    ),

    // ================= LANGUAGES =================
    languages: languages.map((l) => ({
      name: l.name || l.language || "",
      proficiency: l.proficiency || "",
      certificate: l.certificate || "",
    })),

    // ================= CERTIFICATIONS =================
    certifications: certifications.map((c) => ({
      name: c.name || c.title || "",
      issuer: c.issuer || "",
      dateObtained: c.dateObtained || c.year || "",
      credentialId: c.credentialId || "",
      link: c.link || "",
    })),

    // ================= ACHIEVEMENTS =================
    achievements: achievements.map((a) => ({
      title: a.title || "",
      issuer: a.issuer || "",
      date: a.date || "",
      category: a.category || "",
      description: a.description || "",
    })),

    // ================= AWARDS =================
    awards: awards.map((a) => ({
      title: a.title || "",
      issuer: a.issuer || "",
      date: a.date || a.year || "",
      description: a.description || "",
    })),

    // ================= INTERESTS =================
    interests: interests.map((i) => ({
      name: i.name || i.interest || "",
      description: i.description || "",
    })),

    // ================= DECLARATION =================
    declaration: {
      description:
        declaration.description ||
        declaration.declaration ||
        "",
      signature: declaration.signature || "",
    },
  };
};

// utils/formatter.js

export const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return isNaN(d) ? "" : d.toISOString().split("T")[0];
};

export const formatDateForBackend = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

export const normalizeResumeData = (apiResponse = {}) => {
  const { resume, content } = apiResponse;

  const normalizedContent = {
    basics: content?.contactinformation?.[0] || {},

    skills: Array.isArray(content?.skills)
      ? content.skills.map((s) => s.skill_name)
      : [],

    experience: normalizeList(content?.experience),
    projects: normalizeList(content?.projects),
    education: normalizeList(content?.education),

    personalStatement: content?.personalstatements?.[0]?.content || "",

    declaration: content?.declarations?.[0] || {},

    achievements: normalizeList(content?.achievements),
    awards: normalizeList(content?.awards),
    languages: normalizeList(content?.languages),
    certifications: normalizeList(content?.certifications),
    interests: normalizeList(content?.interests),
  };

  return {
    ...normalizedContent,

    meta: resume || {},

    templateId: resume?.template_id || 1,

    sectionsOrder: resume?.sections_order || [
      "basics",
      "personal",
      "skills",
      "experience",
      "projects",
      "education",
      "declaration",
      "certifications",
      "achievements",
      "awards",
      "languages",
      "interests",
    ],
  };
};

export const prepareResumePayload = (resume = {}) => {
  return {
    basics: resume.basics,
    skills: resume.skills,
    experience: prepareList(resume.experience),
    projects: prepareList(resume.projects),
    education: prepareList(resume.education),

    personal_statement: resume.personalStatement,
    declaration: resume.declaration,

    achievements: prepareList(resume.achievements),
    awards: prepareList(resume.awards),
    languages: prepareList(resume.languages),
    certifications: prepareList(resume.certifications),
    interests: prepareList(resume.interests),
  };
};

const normalizeList = (list) => {
  if (!Array.isArray(list)) return [];

  return list.map((item) => ({
    ...item,
    startDate: item.start_date || item.startDate || "",
    endDate: item.end_date || item.endDate || "",
    description: item.description || "",
  }));
};

const prepareList = (list) => {
  if (!Array.isArray(list)) return [];

  return list.map((item) => ({
    ...item,
    startDate: formatDateForBackend(item.startDate),
    endDate: formatDateForBackend(item.endDate),
  }));
};

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

export const normalizeResumeData = (data = {}) => {
  const dataa = data.content;
  return {
    basics: dataa.contactinformation[0] || {},

    skills: Array.isArray(dataa.skills)
      ? dataa.skills.map((s) => s.skill_name)
      : [],
    experience: normalizeList(dataa.experience),
    projects: normalizeList(dataa.projects),
    education: normalizeList(dataa.education),

    personalStatement: Array.isArray(dataa.personalstatements)
      ? dataa.personalstatements[0]?.content || ""
      : dataa.personal_statement || dataa.personalStatement || "",

    declaration: Array.isArray(dataa.declarations)
      ? dataa.declarations[0] || {}
      : dataa.declaration || {},

    achievements: normalizeList(dataa.achievements),
    awards: normalizeList(dataa.awards),
    languages: normalizeList(dataa.languages),
    certifications: normalizeList(dataa.certifications),
    interests: normalizeList(dataa.interests),
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

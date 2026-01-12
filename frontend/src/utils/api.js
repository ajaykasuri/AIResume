import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
};

// Resume API
export const resumeAPI = {
  create: (resumeData) => api.post("/resumes", resumeData),
  getUserResumes: () => api.get("/resumes/users/resumes"),
  getFullResume: (resumeId) => api.get(`/resumes/${resumeId}`),
  update: (resumeId, resumeData) => api.put(`/resumes/${resumeId}`, resumeData),
  delete: (resumeId) => api.delete(`/resumes/${resumeId}`),
  updateSections: (resumeId, sectionsData) =>
    api.put(`/resumes/${resumeId}/sections`, sectionsData),
};

// Section API
export const sectionAPI = {
  save: (resumeId, section, items) =>
    api.post(`/resumes/${resumeId}/${section}`, items),
  bulkSave: (resumeId, sectionsData) =>
    api.put(`/resumes/${resumeId}/bulk-save`, sectionsData),
  deleteItem: (resumeId, section, itemId) =>
    api.delete(`/resumes/${resumeId}/${section}/${itemId}`),
};
// Summary API
export const summaryAPI = {
  generateSummary: (data) => api.post("/summary/generate-summary", data),
  generateProjectSummary: (data) =>
    api.post("/summary/generate-projectSummary", data),
  getTemplates: () => api.get("/summary/templates"),
};

// Generate AI resume
export const aiResumeAPI = {
  generate: (data) => api.post("/ai/generate", data),
};

export default api;

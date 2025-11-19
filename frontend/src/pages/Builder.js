import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import { FaArrowLeft, FaArrowRight, FaCalendar } from "react-icons/fa";

import {
  BasicsForm,
  SkillsForm,
  ExperienceForm,
  ProjectsForm,
  SummaryForm,
  EducationForm,
  DeclarationForm,
} from "../components/Froms";

import ClassicTemplate from "../templates/ClassicTemplate";
import ElegantTemplate from "../templates/ElegantTemplate";
import ModernTemplate from "../templates/ModernTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";

import TemplateModal from "../components/TemplateModal";
import ExtraSectionsModal from "../components/ExtraSectionsModal";
import ResumePreview from "../components/ResumePreview";
import ShareModal from "../components/ShareModal";
import exportToWord from "../utils/wordExport";
const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

const steps = [
  { id: "basics", title: "Basic Info" },
  { id: "skills", title: "Skills" },
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
  { id: "personal", title: "Summary" },
  { id: "education", title: "Education" },
  { id: "declaration", title: "Declaration" },
];

export default function Builder({ token }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isFresher, setIsFresher] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [extraSections, setExtraSections] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [visibleExtraSections, setVisibleExtraSections] = useState([]);
  const [shareableUrl, setShareableUrl] = useState("");
  const [isGeneratingShareUrl, setIsGeneratingShareUrl] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const resumeDownloadRef = useRef();
  const location = useLocation();
  const templateId = location.state?.templateId;
  const templateName = location.state?.templateName;

  const [resume, setResume] = useState({
    title: "My Resume",
    templateId: templateId || 1,
    template: templateName || "Classic",
    sectionsOrder: [
      "basics",
      "skills",
      "experience",
      "projects",
      "personal",
      "education",
      "declaration",
    ],
    data: {
      basics: {
        name: "",
        jobTitle: "",
        email: "",
        phone: "",
        city: "",
        country: "",
        linkedIn: "",
        github: "",
        website: "",
      },
      personalStatement: "",
      skills: [],
      experience: [],
      projects: [],
      education: [],
      declaration: { description: "", signature: "" },
      references: [],
      additional: [],
      courses: [],
      languages: [],
      certifications: [],
      publications: [],
      completionPercentage: 0,
      lastUpdated: new Date().toISOString(),
      achievements: [],
      awards: [],
      interests: [],
    },
  });

  const templates = [
    { id: 1, name: "Classic", img: ClassicTemplate },
    { id: 2, name: "Modern", img: ModernTemplate },
    { id: 3, name: "Executive", img: ExecutiveTemplate },
    { id: 4, name: "Elegant", img: ElegantTemplate },
  ];

  useEffect(() => {
    if (templateId) {
      setSelectedTemplate(templateId);
      setPreviewTemplate(templateId);
    } else {
      setSelectedTemplate(1);
      setPreviewTemplate(1);
    }
  }, [templateId]);

  // Calculate completion percentage
  const calculateCompletion = () => {
    const totalSteps = steps.length;
    const completed = completedSteps.size;
    const percentage = Math.round((completed / totalSteps) * 100);
    setCompletionPercentage(percentage);
    return percentage;
  };

  // Update completion when steps are marked or resume changes
  useEffect(() => {
    calculateCompletion();
  }, [completedSteps, resume]);

  // Validate current step data
  const validateCurrentStep = () => {
    const stepId = steps[currentStep].id;

    switch (stepId) {
      case "basics":
        const { name, jobTitle, email, phone } = resume.data.basics;
        return name && jobTitle && email && phone;

      case "skills":
        return resume.data.skills.length > 0;

      case "experience":
        return isFresher || resume.data.experience.length > 0;

      case "projects":
        return resume.data.projects.length > 0;

      case "personal":
        return resume.data.personalStatement.trim().length > 0;

      case "education":
        return resume.data.education.length > 0;

      case "declaration":
        return resume.data.declaration.description.trim().length > 0;

      default:
        return true;
    }
  };

  // Mark step as completed with validation
  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) => new Set(prev).add(stepId));
  };

  // Auto-mark step as completed when data is valid
  useEffect(() => {
    if (validateCurrentStep()) {
      markStepCompleted(steps[currentStep].id);
    }
  }, [resume, currentStep, isFresher]);

  // Load resume data
  useEffect(() => {
    async function loadResume() {
      try {
        const params = new URLSearchParams(window.location.search);
        const editIdFromUrl = params.get("editId");
        // const editingIdFromStorage = localStorage.getItem("editingResumeId");
        const resumeId = editIdFromUrl;

        if (!resumeId) return;

        const opts = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const { data } = await axios.get(
          `${API}/api/resumes/${resumeId}`,
          opts
        );

        const srv = data;
        // console.log("srv", srv.tempID);

        setResume({
          title: srv.title || "My Resume",
          templateId: srv.tempID ?? templateId ?? 1,
          template: srv.template ?? templateName ?? "Classic",
          sectionsOrder: srv.sectionsOrder ?? [
            "basics",
            "skills",
            "experience",
            "projects",
            "personal",
            "education",
            "declaration",
          ],
          data: {
            basics: srv.data?.basics || {
              name: "",
              jobTitle: "",
              email: "",
              phone: "",
            },
            personalStatement: srv.data?.personalStatement || "",
            skills: srv.data?.skills || [],
            experience: srv.data?.experience || [],
            projects: srv.data?.projects || [],
            education: srv.data?.education || [],
            declaration: {
              description: srv.data?.declaration?.description || "",
              signature: srv.data?.declaration?.signature || "",
            },
            references: srv.data?.references || [],
            additional: srv.data?.additional || [],
            courses: srv.data?.courses || [],
            languages: srv.data?.languages || [],
            certifications: srv.data?.certifications || [],
            publications: srv.data?.publications || [],
            completionPercentage: srv.data?.completionPercentage || 0,
            lastUpdated: srv.data?.lastUpdated || new Date().toISOString(),
            achievements: srv.data?.achievements || [],
            awards: srv.data?.awards || [],
            interests: srv.data?.interests || [],
          },
        });

        // Set selected template from loaded data
        if (srv.tempID) {
          setSelectedTemplate(srv.tempID);
          setPreviewTemplate(srv.tempID);
        }

        // Restore completed steps based on loaded data
        if (srv.data) {
          const loadedCompletedSteps = new Set();
          if (
            srv.data.basics?.name &&
            srv.data.basics?.jobTitle &&
            srv.data.basics?.email &&
            srv.data.basics?.phone
          ) {
            loadedCompletedSteps.add("basics");
          }
          if (srv.data.skills?.length > 0) loadedCompletedSteps.add("skills");
          if (srv.data.experience?.length > 0 || srv.data.isFresher)
            loadedCompletedSteps.add("experience");
          if (srv.data.projects?.length > 0)
            loadedCompletedSteps.add("projects");
          if (srv.data.personalStatement) loadedCompletedSteps.add("personal");
          if (srv.data.education?.length > 0)
            loadedCompletedSteps.add("education");
          if (srv.data.declaration?.description)
            loadedCompletedSteps.add("declaration");

          setCompletedSteps(loadedCompletedSteps);
          setIsFresher(srv.data.isFresher || false);
        }

        // Restore visible extra sections
        // In your loadResume function, update this part:
        const loadedVisibleSections = [];
        if (srv.data?.achievements?.length > 0)
          loadedVisibleSections.push("Achievements");
        if (srv.data?.certifications?.length > 0)
          loadedVisibleSections.push("Certifications");
        if (srv.data?.awards?.length > 0) loadedVisibleSections.push("Awards");
        if (srv.data?.languages?.length > 0)
          loadedVisibleSections.push("Languages");
        if (srv.data?.interests?.length > 0)
          loadedVisibleSections.push("Interests");
        setVisibleExtraSections(loadedVisibleSections);

        if (!editIdFromUrl) localStorage.setItem("editingResumeId", resumeId);
        toast.success("Resume loaded successfully");
      } catch (err) {
        console.error("Failed to load resume:", err);
        toast.error("Failed to load resume");
        localStorage.removeItem("editingResumeId");
      }
    }

    loadResume();
  }, [token, templateId, templateName]);
const handleDownloadWord = async () => {
  if (!validateResume()) return;

  setIsDownloadingWord(true);
  const toastId = toast.loading("Generating Word document...");

  try {
    await handleSave();
    const fileName = `${resume.data.basics.name || "resume"}.doc`;
    
    // Use your working approach
    await exportToWord(resumeDownloadRef, fileName);

    toast.success("Word document downloaded successfully!", { id: toastId });
  } catch (error) {
    console.error("Word download error:", error);
    toast.error("Failed to generate Word document: " + error.message, {
      id: toastId,
    });
  } finally {
    setIsDownloadingWord(false);
  }
};
  // Step navigation
  const nextStep = () => {
    if (validateCurrentStep()) {
      markStepCompleted(steps[currentStep].id);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Resume data handlers
  const updateBasics = (field, value) =>
    setResume((r) => ({
      ...r,
      data: { ...r.data, basics: { ...r.data.basics, [field]: value } },
    }));

  const addSkill = (s) => {
    if (!s.trim()) return;
    setResume((r) => ({
      ...r,
      data: { ...r.data, skills: [...r.data.skills, s.trim()] },
    }));
  };

  const removeSkill = (i) =>
    setResume((r) => ({
      ...r,
      data: { ...r.data, skills: r.data.skills.filter((_, idx) => idx !== i) },
    }));

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      title: "",
      employer: "",
      from: "",
      to: "",
      current: false,
      description: "",
    };
    setResume((r) => ({
      ...r,
      data: { ...r.data, experience: [...r.data.experience, newExp] },
    }));
  };

  const updateExperience = (id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        experience: r.data.experience.map((exp) =>
          exp.id === id ? { ...exp, [field]: value } : exp
        ),
      },
    }));
  };

  const deleteExperience = (id) =>
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        experience: r.data.experience.filter((e) => e.id !== id),
      },
    }));

  const addProject = () => {
    const newProj = {
      id: Date.now(),
      title: "",
      link: "",
      description: "",
      from: "",
      to: "",
      current: false,
      showOptionalFields: false,
      clientName: "",
      teamSize: "",
    };
    setResume((r) => ({
      ...r,
      data: { ...r.data, projects: [...r.data.projects, newProj] },
    }));
  };

  const updateProject = (id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        projects: r.data.projects.map((proj) =>
          proj.id === id ? { ...proj, [field]: value } : proj
        ),
      },
    }));
  };

  const deleteProject = (id) =>
    setResume((r) => ({
      ...r,
      data: { ...r.data, projects: r.data.projects.filter((p) => p.id !== id) },
    }));

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: "",
      institution: "",
      from: "",
      to: "",
      current: false,
    };
    setResume((r) => ({
      ...r,
      data: { ...r.data, education: [...r.data.education, newEdu] },
    }));
  };

  const updateEducation = (id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        education: r.data.education.map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu
        ),
      },
    }));
  };

  const deleteEducation = (id) =>
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        education: r.data.education.filter((e) => e.id !== id),
      },
    }));

  const updateDeclaration = (field, value) =>
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        declaration: { ...r.data.declaration, [field]: value },
      },
    }));

  const updatePersonalStatement = (value) =>
    setResume((r) => ({
      ...r,
      data: { ...r.data, personalStatement: value },
    }));

  // AI Summary Generation
  const handleGenerateSummary = async () => {
    try {
      const { basics, skills, experience, projects } = resume.data;
      const res = await axios.post(`${API}/api/generate-summary`, {
        basics,
        skills,
        experience,
        projects,
        isFresher,
      });
      updatePersonalStatement(res.data.generatedSummary);
      toast.success("AI Summary generated successfully!");
    } catch (error) {
      toast.error("Failed to generate summary");
      console.error(error);
    }
  };
  const handleGenerateProjectSummary = async (projectId) => {
    const project = resume.data.projects.find((p) => p.id === projectId);
    if (!project) return toast.error("Project not found.");

    try {
      toast.loading("Generating project summary...");

      const res = await axios.post(`${API}/api/generate-projectSummary`, {
        projectName: project.title,
        projectDescription: project.description || "No description provided.",
        technologies: project.skillsUsed || [],
        clientName: project.clientName || "",
        teamSize: project.teamSize || "",
      });
      console.log("prosum", res);

      const summary = res.data.generatedProjectSummary;
      updateProject(project.id, "description", summary);

      toast.dismiss();
      toast.success("AI Project Summary generated!");
    } catch (err) {
      console.error("AI Summary Error:", err);
      toast.dismiss();
      toast.error("Failed to generate project summary. Try again later.");
    }
  };

  // Extra Section Handlers
  const addAchievement = () => {
    const newAchievement = {
      id: Date.now(),
      title: "",
      date: "",
      description: "",
      category: "",
      issuer: "",
      link: "",
    };
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        achievements: [...r.data.achievements, newAchievement],
      },
    }));
  };

  const updateAchievement = (id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        achievements: r.data.achievements.map((achievement) =>
          achievement.id === id
            ? { ...achievement, [field]: value }
            : achievement
        ),
      },
    }));
  };

  // In Builder component, update delete functions:
  const deleteAchievement = (id) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        achievements: r.data.achievements.filter((a) => a.id !== id),
      },
    }));

    // Remove from visible sections if no achievements left
    setTimeout(() => {
      setResume((currentResume) => {
        if (currentResume.data.achievements.length === 0) {
          setVisibleExtraSections((prev) =>
            prev.filter((section) => section !== "Achievements")
          );
        }
        return currentResume;
      });
    }, 0);
  };

  // Do the same for other delete functions (certifications, awards, languages, interests)

  const addCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: "",
      issuer: "",
      dateObtained: "",
      expirationDate: "",
      credentialId: "",
      link: "",
    };
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        certifications: [...r.data.certifications, newCertification],
      },
    }));
  };

  const updateCertification = (id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        certifications: r.data.certifications.map((cert) =>
          cert.id === id ? { ...cert, [field]: value } : cert
        ),
      },
    }));
  };

  const deleteCertification = (id) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        certifications: r.data.certifications.filter((c) => c.id !== id),
      },
    }));

    // Remove from visible sections if no certifications left
    setTimeout(() => {
      setResume((currentResume) => {
        if (currentResume.data.certifications.length === 0) {
          setVisibleExtraSections((prev) =>
            prev.filter((section) => section !== "Certifications")
          );
        }
        return currentResume;
      });
    }, 0);
  };
  const addAward = () => {
    const newAward = {
      id: Date.now(),
      title: "",
      date: "",
      issuer: "",
      description: "",
      link: "",
    };
    setResume((r) => ({
      ...r,
      data: { ...r.data, awards: [...r.data.awards, newAward] },
    }));
  };

  const updateAward = (id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        awards: r.data.awards.map((award) =>
          award.id === id ? { ...award, [field]: value } : award
        ),
      },
    }));
  };

  const deleteAward = (id) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        awards: r.data.awards.filter((a) => a.id !== id),
      },
    }));

    // Remove from visible sections if no awards left
    setTimeout(() => {
      setResume((currentResume) => {
        if (currentResume.data.awards.length === 0) {
          setVisibleExtraSections((prev) =>
            prev.filter((section) => section !== "Awards")
          );
        }
        return currentResume;
      });
    }, 0);
  };

  const addLanguage = () => {
    const newLanguage = {
      id: Date.now(),
      name: "",
      proficiency: "",
      certificate: "",
    };
    setResume((r) => ({
      ...r,
      data: { ...r.data, languages: [...r.data.languages, newLanguage] },
    }));
  };

  const updateLanguage = (id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        languages: r.data.languages.map((lang) =>
          lang.id === id ? { ...lang, [field]: value } : lang
        ),
      },
    }));
  };

  const deleteLanguage = (id) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        languages: r.data.languages.filter((l) => l.id !== id),
      },
    }));

    // Remove from visible sections if no languages left
    setTimeout(() => {
      setResume((currentResume) => {
        if (currentResume.data.languages.length === 0) {
          setVisibleExtraSections((prev) =>
            prev.filter((section) => section !== "Languages")
          );
        }
        return currentResume;
      });
    }, 0);
  };

  const addInterest = () => {
    const newInterest = {
      id: Date.now(),
      name: "",
      description: "",
    };
    setResume((r) => ({
      ...r,
      data: { ...r.data, interests: [...r.data.interests, newInterest] },
    }));
  };

  const updateInterest = (id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        interests: r.data.interests.map((interest) =>
          interest.id === id ? { ...interest, [field]: value } : interest
        ),
      },
    }));
  };

  const deleteInterest = (id) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        interests: r.data.interests.filter((i) => i.id !== id),
      },
    }));

    // Remove from visible sections if no interests left
    setTimeout(() => {
      setResume((currentResume) => {
        if (currentResume.data.interests.length === 0) {
          setVisibleExtraSections((prev) =>
            prev.filter((section) => section !== "Interests")
          );
        }
        return currentResume;
      });
    }, 0);
  };

  // Extra Sections Modal Handler
  const handleAddExtra = (type) => {
    setVisibleExtraSections((prev) => {
      // Only add if not already present to avoid duplicates
      if (!prev.includes(type)) {
        return [...prev, type];
      }
      return prev;
    });

    switch (type) {
      case "Achievements":
        addAchievement();
        break;
      case "Certifications":
        addCertification();
        break;
      case "Awards":
        addAward();
        break;
      case "Languages":
        addLanguage();
        break;
      case "Interests":
        addInterest();
        break;
      default:
        const newSec = { id: Date.now(), type, content: "" };
        setExtraSections((prev) => [...prev, newSec]);
        setResume((r) => ({
          ...r,
          sectionsOrder: [...r.sectionsOrder, `extra-${newSec.id}`],
        }));
    }

    setShowExtraModal(false);
  };

  const handleDeleteExtra = (id) => {
    setExtraSections((prev) => prev.filter((s) => s.id !== id));
    setResume((r) => ({
      ...r,
      sectionsOrder: r.sectionsOrder.filter((s) => s !== `extra-${id}`),
    }));
  };

  const updateExtraContent = (id, content) => {
    setExtraSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s))
    );
  };
  // Add these to your main component's state and handlers:

  // Project skills handlers
  const addProjectSkill = (projectId, skill) => {
    setResume((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        projects: prev.data.projects.map((proj) =>
          proj.id === projectId
            ? {
                ...proj,
                skillsUsed: [...(proj.skillsUsed || []), skill],
              }
            : proj
        ),
      },
    }));
  };

  const removeProjectSkill = (projectId, skillIndex) => {
    setResume((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        projects: prev.data.projects.map((proj) =>
          proj.id === projectId
            ? {
                ...proj,
                skillsUsed: proj.skillsUsed.filter(
                  (_, index) => index !== skillIndex
                ),
              }
            : proj
        ),
      },
    }));
  };

  // AI Project Summary handler

  // Template Selection Functions
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setPreviewTemplate(templateId);
  };

  const handleApplyTemplate = () => {
    const selectedTemplateData = templates.find(
      (t) => t.id === selectedTemplate
    );
    // console.log("selectedTemplate", selectedTemplate);
    setResume((prev) => ({
      ...prev,
      templateId: selectedTemplate,
      template: selectedTemplateData?.name || "Classic",
    }));
    setShowTemplateModal(false);
    toast.success(
      `${selectedTemplateData?.name} template applied successfully!`
    );
  };

  const handleOpenTemplateModal = () => {
    setPreviewTemplate(resume.templateId);
    setSelectedTemplate(resume.templateId);
    setShowTemplateModal(true);
  };

  // Validation
  const requiredBasicsFields = ["name", "jobTitle", "email", "phone"];
  const requiredSections = ["experience", "education", "skills"];

  const validateResume = () => {
    const { basics, skills, experience, education } = resume.data;

    for (const field of requiredBasicsFields) {
      if (!basics[field] || basics[field].trim() === "") {
        toast.error(`Please fill in your ${field}`);
        return false;
      }
    }

    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return false;
    }

    if (education.length === 0) {
      toast.error("Please add at least one education entry");
      return false;
    }

    if (!isFresher && experience.length === 0) {
      toast.error("Please add at least one work experience or mark as fresher");
      return false;
    }

    return true;
  };
  const generateShareableUrl = async () => {
    setIsGeneratingShareUrl(true);
    try {
      const currentCompletion = calculateCompletion();

      const dataToShare = {
        ...resume,
        data: {
          ...resume.data,
          completionPercentage: currentCompletion,
          lastUpdated: new Date().toISOString(),
          isFresher: isFresher,
        },
      };

      const opts = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const editingId = localStorage.getItem("editingResumeId");

      let resumeId;
      if (editingId) {
        // Update existing resume
        await axios.put(API + "/api/resumes/" + editingId, dataToShare, opts);
        resumeId = editingId;
      } else {
        // Create new resume
        const response = await axios.post(
          API + "/api/resumes",
          dataToShare,
          opts
        );
        resumeId = response.data.id;
        localStorage.setItem("editingResumeId", resumeId);
      }

      // Generate shareable URL
      const shareUrl = `${window.location.origin}/view/${resumeId}`;
      setShareableUrl(shareUrl);
      setShowShareModal(true);

      toast.success("Shareable URL generated!");
    } catch (error) {
      console.error("Failed to generate share URL:", error);
      toast.error("Failed to generate share URL");
    } finally {
      setIsGeneratingShareUrl(false);
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Failed to copy URL");
    }
  };

  // Download PDF
  const handleDownload = async () => {
    if (!validateResume()) return;
    const element = resumeDownloadRef.current;
    if (!element) return toast.error("Failed to generate PDF");

    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF…");

    try {
      await handleSave();
      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 400));

      await html2pdf()
        .set({
          margin: 0,
          filename: `${resume.data.basics.name || "resume"}.pdf`,
          image: { type: "png", quality: 1.0 },
          html2canvas: {
            scale: 3,
            useCORS: true,
            backgroundColor: "#fff",
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
        })
        .from(element)
        .save();

      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  // Save Resume
  const handleSave = async () => {
    try {
      const currentCompletion = calculateCompletion();

      const dataToSend = {
        ...resume,
        data: {
          ...resume.data,
          completionPercentage: currentCompletion,
          lastUpdated: new Date().toISOString(),
          isFresher: isFresher,
        },
      };

      const opts = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const editingId = localStorage.getItem("editingResumeId");

      if (editingId) {
        await axios.put(API + "/api/resumes/" + editingId, dataToSend, opts);
        toast.success("Updated successfully!");
      } else {
        const response = await axios.post(
          API + "/api/resumes",
          dataToSend,
          opts
        );
        if (response.data && response.data.id) {
          localStorage.setItem("editingResumeId", response.data.id);
        }
        toast.success("Saved successfully!");
      }

      console.log(`Resume saved with ${currentCompletion}% completion`);
    } catch (e) {
      console.error(e);
      toast.error("Save failed");
    }
  };

  // Render form based on current step
  const renderForm = () => {
    switch (currentStep) {
      case 0:
        return <BasicsForm resume={resume} updateBasics={updateBasics} />;
      case 1:
        return (
          <SkillsForm
            resume={resume}
            addSkill={addSkill}
            removeSkill={removeSkill}
          />
        );
      case 2:
        return (
          <ExperienceForm
            resume={resume}
            isFresher={isFresher}
            setIsFresher={setIsFresher}
            addExperience={addExperience}
            updateExperience={updateExperience}
            deleteExperience={deleteExperience}
          />
        );
      case 3:
        return (
          <ProjectsForm
            resume={resume}
            addProject={addProject}
            updateProject={updateProject}
            deleteProject={deleteProject}
            addProjectSkill={addProjectSkill}
            removeProjectSkill={removeProjectSkill}
            handleGenerateProjectSummary={handleGenerateProjectSummary}
          />
        );
      case 4:
        return (
          <SummaryForm
            resume={resume}
            isFresher={isFresher}
            updatePersonalStatement={updatePersonalStatement}
            handleGenerateSummary={handleGenerateSummary}
          />
        );
      case 5:
        return (
          <EducationForm
            resume={resume}
            addEducation={addEducation}
            updateEducation={updateEducation}
            deleteEducation={deleteEducation}
          />
        );
      case 6:
        return (
          <DeclarationForm
            resume={resume}
            updateDeclaration={updateDeclaration}
            visibleExtraSections={visibleExtraSections}
            extraSections={extraSections}
            setShowExtraModal={setShowExtraModal}
            addAchievement={addAchievement}
            updateAchievement={updateAchievement}
            deleteAchievement={deleteAchievement}
            addCertification={addCertification}
            updateCertification={updateCertification}
            deleteCertification={deleteCertification}
            addAward={addAward}
            updateAward={updateAward}
            deleteAward={deleteAward}
            addLanguage={addLanguage}
            updateLanguage={updateLanguage}
            deleteLanguage={deleteLanguage}
            addInterest={addInterest}
            updateInterest={updateInterest}
            deleteInterest={deleteInterest}
            handleDeleteExtra={handleDeleteExtra}
            updateExtraContent={updateExtraContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="builder-container">
      <Toaster position="top-right" reverseOrder={false} />

      <header className="resume-header">
        <div className="resume-header-info">
          {/* title or logo here we need to  add */}
        </div>
        <div className="resume-header-actions">
          <button
            onClick={handleOpenTemplateModal}
            className="resume-btn resume-btn-preview"
          >
            Preview
          </button>
          <button
            onClick={() =>
              exportToWord(
                resumeDownloadRef,
                `${resume.data.basics.name || "resume"}.docx`
              )
            }
            className="resume-btn resume-btn-word"
            disabled={isDownloadingWord}
          >
            {isDownloadingWord ? "Generating..." : "Download Word"}
          </button>

          {/* Add Share Button */}
          {/* <button
            onClick={generateShareableUrl}
            className="resume-btn resume-btn-share"
            disabled={isGeneratingShareUrl}
          >
            {isGeneratingShareUrl ? "Generating..." : "Share Resume"}
          </button> */}

          <button
            onClick={handleDownload}
            className="resume-btn resume-btn-download"
            disabled={isDownloading}
          >
            {isDownloading ? "Generating..." : "Download PDF"}
          </button>

          <button onClick={handleSave} className="resume-btn resume-btn-save">
            Save Resume
          </button>
        </div>
      </header>
      <div className="builder-content">
        <div className="builder-left" id="no-print">
          {/* Progress Indicator */}
          <div className="progress-indicator">
            <div className="progress-header">
              <h3>Resume Completion</h3>
              <span className="progress-percentage">
                {completionPercentage}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="step-container">
            {renderForm()}

            {/* Step Navigation */}
            <div className="step-navigation">
              <button
                className="step-nav-btn step-nav-prev"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <FaArrowLeft /> Previous
              </button>

              <span className="step-progress">
                Step {currentStep + 1} of {steps.length}
              </span>

              <button
                className="step-nav-btn step-nav-next"
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
              >
                Next <FaArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="builder-right">
          <div id="print-container" ref={resumeDownloadRef}>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
      {/* Template Selection Modal */}
      <TemplateModal
        show={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        selectedTemplate={selectedTemplate}
        previewTemplate={previewTemplate}
        onTemplateSelect={handleTemplateSelect}
        onApplyTemplate={handleApplyTemplate}
      />
      {/* Extra Sections Modal */}
      <ExtraSectionsModal
        show={showExtraModal}
        onClose={() => setShowExtraModal(false)}
        onAddExtra={handleAddExtra}
      />
      <ShareModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareableUrl={shareableUrl}
        onCopyUrl={copyToClipboard}
        onDownloadPdf={handleDownload}
        isDownloading={isDownloading}
      />
    </div>
  );
}

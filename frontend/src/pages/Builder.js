import React, { useState, useRef, useEffect, use } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import { FaArrowLeft, FaArrowRight, FaCalendar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

import { sectionAPI, resumeAPI, summaryAPI } from "../utils/api";
// Steps for builder
const steps = [
  { id: "basics", title: "Basic Info" },
  { id: "skills", title: "Skills" },
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
  { id: "personal", title: "Summary" },
  { id: "education", title: "Education" },
  { id: "declaration", title: "Declaration" },
];

const SECTION_MAP = {
  basics: "contact",
  skills: "skills",
  experience: "experience",
  projects: "projects",
  personal: "personal-statement",
  education: "education",
  declaration: "declarations",
};

const EXTRA_SECTIONS = [
  "Achievements",
  "Certifications",
  "Awards",
  "Languages",
  "Interests",
];

const initialResumeState = {
  title: "My Resume",
  templateId: 1,
  template: "Classic",
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
};

export default function Builder({ token }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isFresher, setIsFresher] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [extraSections, setExtraSections] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [previewTemplate, setPreviewTemplate] = useState(1);
  const [visibleExtraSections, setVisibleExtraSections] = useState([]);
  const [shareableUrl, setShareableUrl] = useState("");
  const [isGeneratingShareUrl, setIsGeneratingShareUrl] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [userSections, setUserSections] = useState([]);
  const [resume, setResume] = useState(initialResumeState);

  const navigate = useNavigate();

  const resumeDownloadRef = useRef();
  const location = useLocation();
  const { resume_id } = useParams();

  const templates = [
    { id: 1, name: "Classic", img: ClassicTemplate },
    { id: 2, name: "Modern", img: ModernTemplate },
    { id: 3, name: "Executive", img: ExecutiveTemplate },
    { id: 4, name: "Elegant", img: ElegantTemplate },
  ];

  // Helper functions
  const handleApiError = (error, defaultMessage) => {
    console.error(error);
    const message = error.response?.data?.message || defaultMessage;
    toast.error(message);
    return false;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
  };

  // UPDATED: Update resume completion with current template only
  const updateResumeCompletion = async (resumeId) => {
    try {
      const currentCompletion = calculateCompletion();
      const opts = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      console.log("Updating resume completion percentage:", currentCompletion);
      const response = await resumeAPI.update(resumeId, {
        completion_percentage: currentCompletion,
        last_updated: new Date().toISOString(),
        template_id: resume.templateId,
      });

      setCompletionPercentage(currentCompletion);
      return true;
    } catch (error) {
      console.error("Failed to update completion:", error);
      return false;
    }
  };

  // Section-based API functions
  const saveSection = async (section, items) => {
    try {
      const editingId = localStorage.getItem("editingResumeId");
      console.log("editingId", editingId);

      if (!editingId) {
        console.log("No resume ID found, skipping save");
        return true;
      }

      console.log(`Saving ${section} with items:`, items);
      const response = await sectionAPI.save(editingId, section, items);

      console.log(`Save response for ${section}:`, response);
      // Update completion percentage
      await updateResumeCompletion(editingId);

      return true;
    } catch (error) {
      console.error("SAVE ERROR:", {
        section,
        error: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      return handleApiError(error, `Failed to save ${section} section`);
    }
  };

  // Delete function to update completion
  const deleteSectionItem = async (section, id) => {
    try {
      const editingId = localStorage.getItem("editingResumeId");
      if (!editingId) {
        console.log("No resume ID, skipping delete");
        return true;
      }

      await sectionAPI.deleteItem(editingId, section, id);

      // Update completion percentage after successful deletion
      await updateResumeCompletion(editingId);

      return true;
    } catch (error) {
      return handleApiError(error, `Failed to delete ${section} item`);
    }
  };

  // Individual save function for extra sections
  const handleSaveExtraSection = async (sectionType) => {
    try {
      const sectionMap = {
        achievements: "achievements",
        certifications: "certifications",
        awards: "awards",
        languages: "languages",
        interests: "interests",
      };

      const backendSection = sectionMap[sectionType];
      const formattedData = getSectionDataForBackend(sectionType);

      if (!formattedData || formattedData.length === 0) {
        toast.error(`No ${sectionType} data to save`);
        return false;
      }

      const editingId = localStorage.getItem("editingResumeId");
      if (!editingId) {
        toast.error("Please save the resume first");
        return false;
      }

      const success = await saveSection(backendSection, formattedData);

      if (success) {
        toast.success(
          `${
            sectionType.charAt(0).toUpperCase() + sectionType.slice(1)
          } saved successfully!`
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Failed to save ${sectionType}:`, error);
      toast.error(`Failed to save ${sectionType}`);
      return false;
    }
  };

  // Helper function to get extra section data for backend
  const getExtraSectionDataForBackend = (sectionType) => {
    const sectionData = resume.data[sectionType];
    if (!sectionData || sectionData.length === 0) return null;

    // Filter out empty items
    const validItems = sectionData.filter((item) => {
      switch (sectionType) {
        case "achievements":
          return item.title && item.title.trim();
        case "certifications":
          return item.name && item.name.trim();
        case "awards":
          return item.title && item.title.trim();
        case "languages":
          return item.name && item.name.trim();
        case "interests":
          return item.name && item.name.trim();
        default:
          return false;
      }
    });

    if (validItems.length === 0) return null;

    return validItems;
  };

  // Save current section with reload
  const saveCurrentSection = async () => {
    console.log("Saving current section:", steps[currentStep].id);
    try {
      setIsSavingSection(true);
      const currentStepId = steps[currentStep].id;
      const backendSection = SECTION_MAP[currentStepId];
      const editingId = localStorage.getItem("editingResumeId");

      if (!backendSection) {
        console.log("No backend section mapping for:", currentStepId);
        return true;
      }

      const sectionData = getSectionDataForBackend(currentStepId);

      if (sectionData && sectionData.length > 0 && editingId) {
        const success = await saveSection(backendSection, sectionData);

        if (success) {
          // Reload the resume to get fresh data with proper IDs (no toast)
          await loadResume(editingId, true);

          const message =
            isFresher && currentStepId === "experience"
              ? "Fresher status saved!"
              : `${steps[currentStep].title} saved!`;
          toast.success(message);
          setCompletionPercentage(calculateCompletion());
        }
        return success;
      } else {
        // If no data to save, still update completion
        if (editingId) {
          await updateResumeCompletion(editingId);
        }
        return true;
      }
    } catch (error) {
      console.error("Failed to save current section:", error);
      return false;
    } finally {
      setIsSavingSection(false);
    }
  };

  const getSectionDataForBackend = (sectionId) => {
    // Helper function to format dates for MySQL
    const formatDateForMySQL = (dateString) => {
      if (!dateString) return null;

      // If it's already in YYYY-MM-DD format, return as-is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // If it's an ISO string, extract the date part
      if (typeof dateString === "string" && dateString.includes("T")) {
        return dateString.split("T")[0];
      }

      // If it's a Date object
      if (dateString instanceof Date) {
        return dateString.toISOString().split("T")[0];
      }

      // Try to parse as Date object
      try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0];
        }
      } catch (error) {
        console.warn("Failed to parse date:", dateString, error);
      }

      return null;
    };

    const formatters = {
      basics: () => {
        const { basics } = resume.data;
        if (
          !basics.name &&
          !basics.jobTitle &&
          !basics.email &&
          !basics.phone
        ) {
          return null;
        }
        return [
          {
            name: basics.name,
            job_title: basics.jobTitle,
            email: basics.email,
            phone: basics.phone,
            city: basics.city,
            country: basics.country,
            linkedin: basics.linkedIn,
            github: basics.github,
            website: basics.website,
          },
        ];
      },
      skills: () => {
        if (resume.data.skills.length === 0) return null;
        return resume.data.skills.map((skill) => ({ skill_name: skill }));
      },
      experience: () => {
        // For freshers, we need to save a placeholder record with is_fresher = true
        if (isFresher) {
          // Return a single record with is_fresher = true
          return [
            {
              is_fresher: true,
              title: "Fresh Graduate",
              employer: "No prior work experience",
              from: new Date().toISOString().split("T")[0],
              to: new Date().toISOString().split("T")[0],
              current: false,
              description:
                "I am a fresh graduate seeking opportunities to apply my knowledge and skills.",
            },
          ];
        }

        // Only save actual experiences for non-freshers
        const validExperience = resume.data.experience.filter(
          (exp) => exp.title?.trim() && exp.employer?.trim() && exp.from
        );

        return validExperience.map(({ id, ...exp }) => ({
          is_fresher: false, // For actual experiences, always false
          title: exp.title,
          employer: exp.employer,
          from: formatDateForMySQL(exp.from),
          to: formatDateForMySQL(exp.to),
          current: exp.current,
          description: exp.description,
        }));
      },
      projects: () => {
        if (resume.data.projects.length === 0) return null;
        const validProjects = resume.data.projects.filter(
          (proj) => proj.title.trim() || proj.description.trim()
        );
        if (validProjects.length === 0) return null;
        return validProjects.map(({ id, ...proj }) => ({
          title: proj.title,
          link: proj.link,
          description: proj.description,
          from: formatDateForMySQL(proj.from),
          to: formatDateForMySQL(proj.to),
          current: proj.current,
          client_name: proj.clientName,
          team_size: proj.teamSize,
          skills_used: proj.skillsUsed ? proj.skillsUsed.join(",") : "",
        }));
      },
      personal: () => {
        if (!resume.data.personalStatement.trim()) return null;
        return [{ statement_text: resume.data.personalStatement }];
      },
      education: () => {
        if (resume.data.education.length === 0) return null;
        const validEducation = resume.data.education.filter(
          (edu) => edu.degree.trim() || edu.institution.trim()
        );
        if (validEducation.length === 0) return null;
        return validEducation.map(({ id, ...edu }) => ({
          degree: edu.degree,
          institution: edu.institution,
          from: formatDateForMySQL(edu.from),
          to: formatDateForMySQL(edu.to),
          current: edu.current,
        }));
      },
      declaration: () => {
        if (!resume.data.declaration.description.trim()) return null;
        return [
          {
            description: resume.data.declaration.description,
            signature: resume.data.declaration.signature,
          },
        ];
      },
      certifications: () => {
        if (resume.data.certifications.length === 0) return null;
        const validCerts = resume.data.certifications.filter(
          (cert) => cert.name && cert.name.trim()
        );
        if (validCerts.length === 0) return null;
        return validCerts.map(({ id, ...cert }) => ({
          certification_name: cert.name,
          issuing_organization: cert.issuer,
          issue_date: formatDateForMySQL(cert.dateObtained),
          expiration_date: formatDateForMySQL(cert.expirationDate),
          credential_id: cert.credentialId,
          certification_url: cert.link,
        }));
      },
      achievements: () => {
        if (resume.data.achievements.length === 0) return null;
        const validAchievements = resume.data.achievements.filter(
          (ach) => ach.title && ach.title.trim()
        );
        if (validAchievements.length === 0) return null;
        return validAchievements.map(({ id, ...ach }) => ({
          achievement_title: ach.title,
          achievement_date: formatDateForMySQL(ach.date),
          description: ach.description,
          category: ach.category,
          issuer: ach.issuer,
          achievement_url: ach.link,
        }));
      },
      awards: () => {
        if (resume.data.awards.length === 0) return null;
        const validAwards = resume.data.awards.filter(
          (award) => award.title && award.title.trim()
        );
        if (validAwards.length === 0) return null;
        return validAwards.map(({ id, ...award }) => ({
          award_title: award.title,
          award_date: formatDateForMySQL(award.date),
          issuing_organization: award.issuer,
          description: award.description,
          award_url: award.link,
        }));
      },
      languages: () => {
        if (resume.data.languages.length === 0) return null;
        const validLanguages = resume.data.languages.filter(
          (lang) => lang.name && lang.name.trim()
        );
        if (validLanguages.length === 0) return null;
        return validLanguages.map(({ id, ...lang }) => ({
          language_name: lang.name,
          proficiency_level: lang.proficiency,
          certificate: lang.certificate,
        }));
      },
      interests: () => {
        if (resume.data.interests.length === 0) return null;
        const validInterests = resume.data.interests.filter(
          (interest) => interest.name && interest.name.trim()
        );
        if (validInterests.length === 0) return null;
        return validInterests.map(({ id, ...interest }) => ({
          interest_name: interest.name,
          description: interest.description,
        }));
      },
    };

    return formatters[sectionId] ? formatters[sectionId]() : null;
  };

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

  useEffect(() => {
    // Check if we have AI-generated data in location state
    if (location.state?.isFromAI && location.state?.aiGeneratedData) {
      const aiData = location.state.aiGeneratedData;

      // console.log(" Applying AI generated data to resume:", aiData);
      // console.log(" Current resume before update:", resume.data.basics);

      // Use a functional update to ensure we get the latest state
      setResume((prev) => {
        // console.log("🔄 Previous resume state in setResume:", prev.data.basics);

        const updated = {
          ...prev,
          data: {
            ...prev.data,
            basics: {
              ...prev.data.basics,
              name: aiData.basics.name || prev.data.basics.name,
              jobTitle: aiData.basics.jobTitle || prev.data.basics.jobTitle,
              email: aiData.basics.email || prev.data.basics.email,
              phone: aiData.basics.phone || prev.data.basics.phone,
              // Keep other fields from prev.data.basics
              city: prev.data.basics.city,
              country: prev.data.basics.country,
              linkedIn: prev.data.basics.linkedIn,
              github: prev.data.basics.github,
              website: prev.data.basics.website,
            },
            personalStatement:
              aiData.personalStatement || prev.data.personalStatement,
            skills:
              aiData.skills && aiData.skills.length > 0
                ? [...aiData.skills]
                : prev.data.skills,
            projects:
              aiData.projects && aiData.projects.length > 0
                ? aiData.projects.map((proj) => ({
                    id: proj.id || Date.now() + Math.random(),
                    title: proj.title || "",
                    description: proj.description || "",
                    from: proj.from || "",
                    to: proj.to || "",
                    current: proj.current || false,
                    link: proj.link || "",
                    clientName: proj.clientName || "",
                    teamSize: proj.teamSize || "",
                    skillsUsed: proj.skillsUsed || [],
                  }))
                : prev.data.projects,
            declaration: {
              ...prev.data.declaration,
              description:
                aiData.declaration?.description ||
                prev.data.declaration.description,
              signature:
                aiData.declaration?.signature ||
                prev.data.declaration.signature,
            },
          },
        };

        return updated;
      });

      // Mark relevant steps as completed
      const newCompletedSteps = new Set();
      if (aiData.basics.name && aiData.basics.jobTitle) {
        newCompletedSteps.add("basics");
      }
      if (aiData.skills && aiData.skills.length > 0) {
        newCompletedSteps.add("skills");
      }
      if (aiData.projects && aiData.projects.length > 0) {
        newCompletedSteps.add("projects");
      }
      if (aiData.personalStatement) {
        newCompletedSteps.add("personal");
      }
      if (aiData.declaration?.description) {
        newCompletedSteps.add("declaration");
        console.log(" Marked declaration as completed");
      }

      console.log(" Completed steps:", Array.from(newCompletedSteps));
      setCompletedSteps(newCompletedSteps);

      // Set current step to basics (step 0) to see the data
      setCurrentStep(0);
      console.log(" Set current step to 0 (basics)");

      // Clear the location state after applying (with delay to ensure state updates)
      // setTimeout(() => {
      //   navigate(location.pathname, { replace: true, state: {} });
      //   console.log(" Cleared location state");
      // }, 500);
    }
  }, [location.state, navigate]);

  // Validate current step data
  const validateCurrentStep = () => {
    const stepId = steps[currentStep].id;

    switch (stepId) {
      case "basics":
        const { name, jobTitle, email, phone } = resume.data.basics;
        return name && jobTitle && validateEmail(email) && validatePhone(phone);

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

  useEffect(() => {
    const loadResumeId = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const resumeIdFromUrl =
        resume_id || urlParams.get("resumeId") || urlParams.get("editId");
      console.log(
        "Resume ID from URL or params:",
        resumeIdFromUrl,
        location.state?.isFromAI
      );
      console.log(" beforeStoring resume ID in localStorage:", resumeIdFromUrl);
      if (resumeIdFromUrl) {
        console.log(" Storing resume ID in localStorage:", resumeIdFromUrl);
        localStorage.setItem("editingResumeId", resumeIdFromUrl);
        setResumeId(resumeIdFromUrl);
        return resumeIdFromUrl;
      }
      return null;
      // Check for AI data - if we have AI data, DO NOT load from API at all
      if (location.state?.isFromAI) {
        console.log(" Skipping API load completely because we have AI datas");
        return null;
      }
    };

    const resumeIdToLoad = loadResumeId();
    if (resumeIdToLoad) {
      loadResume(resumeIdToLoad);
    }
  }, [resume_id, location.state]);

  const loadResume = async (id, isReload = false) => {
    if (!id) return;

    // Add this check to prevent loading when we have AI data
    if (location.state?.isFromAI) {
      console.log("Skipping API load because we have AI data");
      return;
    }

    try {
      if (!isReload) setIsLoading(true);

      const { data } = await resumeAPI.getFullResume(id);

      console.log("Full backend response:", data);

      if (data) {
        const selectedSectionKeys = data.sections.map(
          (section) => section.section_key
        );
        setUserSections(selectedSectionKeys);

        const content = data.content;

        const hasFresherExperience =
          content.experience?.some((exp) => exp.is_fresher === 1) || false;

        setIsFresher(hasFresherExperience);

        // console.log(
        //   hasFresherExperience
        //     ? "User is marked as fresher."
        //     : "User is not a fresher."
        // );
        const resumeData = data.resume;
        // console.log("Backend resume data:", resumeData);
        // console.log("Backend content data:", content);
        const transformedData = transformBackendToFrontend(
          content,
          selectedSectionKeys,
          resumeData
        );
        setResume(transformedData);

        const loadedTemplateId = data.resume?.template_id || 1;
        setSelectedTemplate(loadedTemplateId);
        setPreviewTemplate(loadedTemplateId);
        // console.log("Loaded template ID:", loadedTemplateId);
        if (data.resume?.completion_percentage) {
          setCompletionPercentage(data.resume.completion_percentage);
        } else {
          setCompletionPercentage(calculateCompletion());
        }

        const newCompletedSteps = new Set();
        steps.forEach((step) => {
          if (validateStepData(step.id, transformedData)) {
            newCompletedSteps.add(step.id);
          }
        });
        setCompletedSteps(newCompletedSteps);

        if (!isReload) {
          toast.success("Resume loaded successfully!");
        }
      }
    } catch (err) {
      console.error("Failed to load resume:", err);
      if (!isReload) toast.error("Failed to load resume");
      localStorage.removeItem("editingResumeId");
    } finally {
      if (!isReload) setIsLoading(false);
    }
  };

  const getStepKey = (stepId) => {
    const stepToKeyMap = {
      basics: "personal_info",
      personal: "profile",
      experience: "experience",
      education: "education",
      skills: "skills",
      projects: "projects",
      declaration: "declarations",
      achievements: "achievements",
      certifications: "certifications",
      languages: "languages",
      courses: "courses",
      internships: "internships",
      publications: "publications",
      // volunteer: "volunteer",
      interests: "interests",
      references: "references",
      awards: "awards",
      contactinformation: "personal_info",
    };
    return stepToKeyMap[stepId] || stepId;
  };

  // Transformation function
  const transformBackendToFrontend = (
    backendData,
    selectedSectionKeys,
    resumeData
  ) => {
    const transformed = {
      ...initialResumeState,
      resume_id: resumeData?.resume_id,
      title: resumeData?.resume_name || "My Resume",
      templateId: resumeData?.template_id || 1,
      template: resumeData?.template_name || "Classic",
      data: {
        ...initialResumeState.data,
        // Basics (Contact Information)
        basics: backendData.contactinformation?.[0]
          ? {
              name: backendData.contactinformation[0].full_name || "",
              jobTitle: backendData.contactinformation[0].job_title || "",
              email: backendData.contactinformation[0].email || "",
              phone: backendData.contactinformation[0].phone_number || "",
              city: backendData.contactinformation[0].city || "",
              country: backendData.contactinformation[0].country || "",
              linkedIn:
                backendData.contactinformation[0].linkedin_profile || "",
              github: backendData.contactinformation[0].github_profile || "",
              website: backendData.contactinformation[0].personal_website || "",
            }
          : initialResumeState.data.basics,

        // Personal Statement
        personalStatement: backendData.personalstatements?.[0]?.content || "",

        // Skills
        skills: backendData.skills?.map((skill) => skill.skill_name) || [],

        experience:
          backendData.experience
            ?.filter((exp) => !exp.is_fresher)
            .filter((exp) => exp.job_title && exp.company_name)
            .map((exp) => ({
              exp_id: exp.exp_id || Date.now(),
              title: exp.job_title || "",
              employer: exp.company_name || "",
              from: exp.start_date || "",
              to: exp.end_date || "",
              current: exp.is_current_job || false,
              description: exp.description || "",
            })) || [],

        // Projects
        projects:
          backendData.projects?.map((proj) => ({
            id: proj.project_id || Date.now(),
            title: proj.project_name || "",
            link: proj.project_url || "",
            description: proj.description || "",
            from: proj.start_date || "",
            to: proj.end_date || "",
            current: proj.is_current_project || false,
            clientName: proj.client_name || "",
            teamSize: proj.team_size || "",
            skillsUsed: Array.isArray(proj.skills) ? proj.skills : [],
          })) || [],

        // Education
        education:
          backendData.education?.map((edu) => ({
            id: edu.education_id || Date.now(),
            degree: edu.degree || "",
            institution: edu.institution_name || "",
            from: edu.start_date || "",
            to: edu.end_date || "",
            current: edu.is_current_education || false,
          })) || [],

        // Declaration
        declaration: backendData.declarations?.[0]
          ? {
              description: backendData.declarations[0].description || "",
              signature: backendData.declarations[0].signature || "",
            }
          : initialResumeState.data.declaration,

        // Extra Sections
        achievements:
          backendData.achievements?.map((ach) => ({
            id: ach.achievement_id || Date.now(),
            title: ach.title || "",
            date: ach.achievement_date || "",
            description: ach.description || "",
            category: ach.category || "",
            issuer: ach.issuer || "",
            link: ach.achievement_url || "",
          })) || [],

        certifications:
          backendData.certifications?.map((cert) => ({
            id: cert.certification_id || Date.now(),
            name: cert.certification_name || "",
            issuer: cert.issuing_organization || "",
            dateObtained: cert.issue_date || "",
            expirationDate: cert.expiration_date || "",
            credentialId: cert.credential_id || "",
            link: cert.certification_url || "",
          })) || [],

        awards:
          backendData.awards?.map((award) => ({
            id: award.award_id || Date.now(),
            title: award.award_name || "",
            date: award.award_date || "",
            issuer: award.awarding_organization || "",
            description: award.description || "",
            link: award.award_url || "",
          })) || [],

        languages:
          backendData.languages?.map((lang) => ({
            id: lang.language_id || Date.now(),
            name: lang.language_name || "",
            proficiency: lang.proficiency || "",
            certificate: lang.certificate || "",
          })) || [],

        interests:
          backendData.interests?.map((interest) => ({
            id: interest.interest_id || Date.now(),
            name: interest.interest_name || "",
            description: interest.description || "",
          })) || [],
      },
    };

    return transformed;
  };

  // Helper to validate step data for completion
  const validateStepData = (stepId, resumeData) => {
    switch (stepId) {
      case "basics":
        const { name, jobTitle, email, phone } = resumeData.data.basics;
        return name && jobTitle && validateEmail(email) && validatePhone(phone);
      case "skills":
        return resumeData.data.skills.length > 0;
      case "experience":
        // IMPORTANT: For freshers, we don't require experience
        return isFresher || resumeData.data.experience.length > 0;
      case "projects":
        return resumeData.data.projects.length > 0;
      case "personal":
        return resumeData.data.personalStatement.trim().length > 0;
      case "education":
        return resumeData.data.education.length > 0;
      case "declaration":
        return resumeData.data.declaration.description.trim().length > 0;
      default:
        return false;
    }
  };

  const handleDownloadWord = async () => {
    if (!validateResume()) return;

    setIsDownloadingWord(true);
    const toastId = toast.loading("Generating Word document...");

    try {
      await handleSave();
      const fileName = `${resume.data.basics.name || "resume"}.doc`;

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

  // Step navigation with Save & Next to update completion
  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (saveSuccess) {
      toast.success("All sections completed!");
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

  // Skills delete to update completion
  const removeSkill = (i) => {
    setResume((r) => ({
      ...r,
      data: { ...r.data, skills: r.data.skills.filter((_, idx) => idx !== i) },
    }));

    // For skills, we need to save the entire section after deletion
    const saveSkillsAfterDelete = async () => {
      const editingId = localStorage.getItem("editingResumeId");
      if (editingId) {
        try {
          const skillsData = getSectionDataForBackend("skills");
          if (skillsData) {
            await saveSection("skills", skillsData);
          }
        } catch (error) {
          console.error("Failed to save skills after deletion:", error);
        }
      }
    };

    saveSkillsAfterDelete();
  };

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

  // Experience delete with reload
  const deleteExperience = async (id) => {
    const experienceItem = resume.data.experience.find(
      (exp) => exp.id === id || exp.exp_id === id
    );
    if (!experienceItem) return;

    // Don't allow deletion if it's the fresher placeholder
    if (isFresher && resume.data.experience.length === 1) {
      toast.error(
        "Cannot delete experience record for freshers. Please uncheck 'I'm a fresher' first."
      );
      return;
    }

    // Optimistic frontend update
    setResume((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        experience: prev.data.experience.filter(
          (e) => e.id !== id && e.exp_id !== id
        ),
      },
    }));

    // Only call backend if saved in DB
    console.log("Experience item to delete:", experienceItem);
    console.log("Experience item exp_id:", experienceItem.exp_id);
    if (!experienceItem.exp_id) {
      console.log("Unsaved experience deleted from frontend only.");
      return;
    }

    // Call backend for saved item
    try {
      await deleteSectionItem("experience", experienceItem.exp_id);
      toast.success("Experience deleted successfully!");
    } catch (error) {
      console.error("Failed to delete experience from backend:", error);
      toast.error("Failed to delete experience. Reloading...");
      await loadResume(resume.resume_id, true);
    }
  };

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

  // Project delete with reload
  const deleteProject = async (id) => {
    const editingId = localStorage.getItem("editingResumeId");
    const projectItem = resume.data.projects.find((p) => p.id === id);
    if (!projectItem) return;

    setResume((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        projects: prev.data.projects.filter((p) => p.project_id !== id),
      },
    }));

    if (!projectItem.id) {
      return;
    }

    try {
      await deleteSectionItem("projects", projectItem.id);
      await loadResume(editingId, true);
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Backend delete failed:", error);
      toast.error("Failed to delete project. Restoring data...");
      await loadResume(editingId, true); // rollback
    }
  };

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

  // Education delete with reload
  const deleteEducation = async (id) => {
    const educationItem = resume.data.education.find((edu) => edu.id === id);
    const editingId = localStorage.getItem("editingResumeId");
    console.log("Deleting education item:", educationItem);
    if (!educationItem) return;

    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        education: r.data.education.filter((e) => e.id !== id),
      },
    }));
    if (!educationItem.id) return;
    try {
      await deleteSectionItem("education", educationItem.id, resumeId);
      toast.success("Education deleted successfully!");
    } catch (error) {
      console.error("Backend delete failed:", error);
      toast.error("Delete failed. Reloading...");
      await loadResume(resumeId, true); // rollback
    }
  };

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
      const res = await summaryAPI.generateSummary({
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

      const res = await summaryAPI.generateProjectSummary({
        projectName: project.title,
        projectDescription: project.description || "No description provided.",
        technologies: project.skillsUsed || [],
        clientName: project.clientName || "",
        teamSize: project.teamSize || "",
      });

      updateProject(
        project.id,
        "description",
        res.data.generatedProjectSummary
      );

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

  // Achievement delete with reload
  const deleteAchievement = async (id) => {
    const achievementItem = resume.data.achievements.find(
      (ach) => ach.id === id
    );
    const editingId = localStorage.getItem("editingResumeId");

    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        achievements: r.data.achievements.filter((a) => a.id !== id),
      },
    }));

    if (editingId && achievementItem.title) {
      try {
        await deleteSectionItem("achievements", id);
        await loadResume(editingId, true);
        toast.success("Achievement deleted successfully!");
      } catch (error) {
        console.error("Failed to delete achievement from backend:", error);
        await loadResume(editingId, true);
        toast.error("Failed to delete achievement. Please try again.");
      }
    }

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

  // Certification delete with reload
  const deleteCertification = async (id) => {
    const certificationItem = resume.data.certifications.find(
      (cert) => cert.id === id
    );
    const editingId = localStorage.getItem("editingResumeId");

    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        certifications: r.data.certifications.filter((c) => c.id !== id),
      },
    }));

    if (editingId && certificationItem.name) {
      try {
        await deleteSectionItem("certifications", id);
        await loadResume(editingId, true);
        toast.success("Certification deleted successfully!");
      } catch (error) {
        console.error("Failed to delete certification from backend:", error);
        await loadResume(editingId, true);
        toast.error("Failed to delete certification. Please try again.");
      }
    }

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

  // Award delete with reload
  const deleteAward = async (id) => {
    const awardItem = resume.data.awards.find((award) => award.id === id);
    const editingId = localStorage.getItem("editingResumeId");

    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        awards: r.data.awards.filter((a) => a.id !== id),
      },
    }));

    if (editingId && awardItem.title) {
      try {
        await deleteSectionItem("awards", id);
        await loadResume(editingId, true);
        toast.success("Award deleted successfully!");
      } catch (error) {
        console.error("Failed to delete award from backend:", error);
        await loadResume(editingId, true);
        toast.error("Failed to delete award. Please try again.");
      }
    }

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

  // Language delete with reload
  const deleteLanguage = async (id) => {
    const languageItem = resume.data.languages.find((lang) => lang.id === id);
    const editingId = localStorage.getItem("editingResumeId");

    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        languages: r.data.languages.filter((l) => l.id !== id),
      },
    }));

    if (editingId && languageItem.name) {
      try {
        await deleteSectionItem("languages", id);
        await loadResume(editingId, true);
        toast.success("Language deleted successfully!");
      } catch (error) {
        console.error("Failed to delete language from backend:", error);
        await loadResume(editingId, true);
        toast.error("Failed to delete language. Please try again.");
      }
    }

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

  // Interest delete with reload
  const deleteInterest = async (id) => {
    const interestItem = resume.data.interests.find(
      (interest) => interest.id === id
    );
    const editingId = localStorage.getItem("editingResumeId");

    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        interests: r.data.interests.filter((i) => i.id !== id),
      },
    }));

    if (editingId && interestItem.name) {
      try {
        await deleteSectionItem("interests", id);
        await loadResume(editingId, true);
        toast.success("Interest deleted successfully!");
      } catch (error) {
        console.error("Failed to delete interest from backend:", error);
        await loadResume(editingId, true);
        toast.error("Failed to delete interest. Please try again.");
      }
    }

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

  // UPDATED: Template Selection Functions
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setPreviewTemplate(templateId);
  };

  // UPDATED: Template application with immediate save
  const handleApplyTemplate = async () => {
    console.log("Applying template ID:", selectedTemplate);
    const selectedTemplateData = templates.find(
      (t) => t.id === selectedTemplate
    );

    // Update the resume state with the new template
    setResume((prev) => ({
      ...prev,
      templateId: selectedTemplate,
      template: selectedTemplateData?.name || "Classic",
    }));

    // Immediately save the template change to backend
    const editingId = localStorage.getItem("editingResumeId");
    if (editingId) {
      try {
        // Save template change
        await resumeAPI.update(editingId, {
          template_id: selectedTemplate,
          last_updated: new Date().toISOString(),
        });

        toast.success(
          `${selectedTemplateData?.name} template applied and saved successfully!`
        );
      } catch (error) {
        console.error("Failed to save template:", error);
        toast.error("Template applied but failed to save to backend");
      }
    } else {
      toast.success(
        `${selectedTemplateData?.name} template applied successfully!`
      );
    }

    setShowTemplateModal(false);
  };

  const handleOpenTemplateModal = () => {
    setPreviewTemplate(resume.templateId);
    setSelectedTemplate(resume.templateId);
    setShowTemplateModal(true);
  };

  // Reset resume functionality
  const handleResetResume = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This cannot be undone."
      )
    ) {
      setResume(initialResumeState);
      setCompletedSteps(new Set());
      setCurrentStep(0);
      setIsFresher(false);
      setVisibleExtraSections([]);
      setExtraSections([]);
      setCompletionPercentage(0);
      toast.success("Resume reset successfully");
    }
  };

  // Validation
  const validateResume = () => {
    const { basics, skills, experience, education } = resume.data;

    const requiredBasicsFields = ["name", "jobTitle", "email", "phone"];
    for (const field of requiredBasicsFields) {
      if (!basics[field] || basics[field].trim() === "") {
        toast.error(`Please fill in your ${field}`);
        return false;
      }
    }

    if (!validateEmail(basics.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!validatePhone(basics.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
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

  // UPDATED: Generate shareable URL to include template
  // const generateShareableUrl = async () => {
  //   setIsGeneratingShareUrl(true);
  //   try {
  //     const currentCompletion = calculateCompletion();

  //     // Prepare resume data WITH template and completion percentage
  //     const resumeData = {
  //       resume_name: resume.title || "My Resume",
  //       template_id: resume.templateId,
  //       completion_percentage: currentCompletion,
  //       last_updated: new Date().toISOString(),
  //     };

  //     const opts = token
  //       ? { headers: { Authorization: `Bearer ${token}` } }
  //       : {};
  //     const editingId = localStorage.getItem("editingResumeId");

  //     let resumeId;
  //     if (editingId) {
  //       // Update existing resume with current template and completion
  //       await axios.put(
  //         `${API}/api/resumes/resumes/${editingId}`,
  //         resumeData,
  //         opts
  //       );
  //       resumeId = editingId;
  //     } else {
  //       // Create new resume with template and completion
  //       const response = await axios.post(
  //         `${API}/api/resumes/resumes`,
  //         resumeData,
  //         opts
  //       );
  //       resumeId = response.data.resume_id;
  //       localStorage.setItem("editingResumeId", resumeId);
  //       setResumeId(resumeId);
  //     }

  //     const shareUrl = `${window.location.origin}/view/${resumeId}`;
  //     setShareableUrl(shareUrl);
  //     setShowShareModal(true);

  //     toast.success("Shareable URL generated!");
  //   } catch (error) {
  //     handleApiError(error, "Failed to generate share URL");
  //   } finally {
  //     setIsGeneratingShareUrl(false);
  //   }
  // };

  // // Copy URL to clipboard
  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(shareableUrl);
  //     toast.success("URL copied to clipboard!");
  //   } catch (error) {
  //     handleApiError(error, "Failed to copy URL");
  //   }
  // };

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

  // UPDATED: Save Resume function to ensure template is saved
  const handleSave = async () => {
    try {
      const currentCompletion = calculateCompletion();

      const editingId = localStorage.getItem("editingResumeId");

      let savedResumeId = editingId;

      console.log("Handling save:", editingId);

      // Prepare ALL sections data for bulk save
      const sectionsData = {
        contact: getSectionDataForBackend("basics") || [],
        skills: getSectionDataForBackend("skills") || [],
        experience: getSectionDataForBackend("experience") || [],
        projects: getSectionDataForBackend("projects") || [],
        "personal-statement": getSectionDataForBackend("personal") || [],
        education: getSectionDataForBackend("education") || [],
        declarations: getSectionDataForBackend("declaration") || [],
        achievements: getSectionDataForBackend("achievements") || [],
        certifications: getSectionDataForBackend("certifications") || [],
        awards: getSectionDataForBackend("awards") || [],
        languages: getSectionDataForBackend("languages") || [],
        interests: getSectionDataForBackend("interests") || [],
      };

      // console.log("Saving with template ID:", resume.templateId);
      // console.log("Sections data to save:", sectionsData);
      // console.log("Editing ID:",savedResumeId)
      //       if (!editingId) {
      //         // Create new resume first with current template
      //         const createResponse = await axios.post(
      //           `${API}/api/resumes/resumes`,
      //           {
      //             resume_name: resume.title,
      //             template_id: resume.templateId,
      //             completion_percentage: currentCompletion,
      //           },
      //           opts
      //         );
      // console.log("Create resume response:", createResponse.data.resume_id);
      //         if (createResponse.data && createResponse.data.resume_id) {
      //           savedResumeId = createResponse.data.resume_id;
      //           localStorage.setItem("editingResumeId", savedResumeId);
      //           setResumeId(savedResumeId);
      //         } else {
      //           throw new Error("Failed to create resume");
      //         }
      //       }

      // Use your existing bulk save endpoint
      const response = await sectionAPI.bulkSave(savedResumeId, sectionsData);

      console.log("Bulk save response:", response);
      // Update resume metadata with completion percentage AND template
      const response2 = await resumeAPI.update(savedResumeId, {
        resume_name: resume.data.basics.name || "My Resume",
        template_id: resume.templateId,
        completion_percentage: currentCompletion,
        last_updated: new Date().toISOString(),
      });

      // console.log("Resume metadata update response:", response2);
      // Update completion percentage in state WITHOUT reloading entire resume
      setCompletionPercentage(currentCompletion);

      toast.success(
        editingId
          ? "Resume updated successfully!"
          : "Resume saved successfully!"
      );
      return true;
    } catch (e) {
      handleApiError(e, "Save failed");
      return false;
    }
  };
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "ArrowLeft":
            e.preventDefault();
            prevStep();
            break;
          case "ArrowRight":
            e.preventDefault();
            nextStep();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [currentStep]);

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
            handleSaveExtraSection={handleSaveExtraSection}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="builder-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-container">
      <Toaster position="top-right" reverseOrder={false} />

      <header className="resume-header">
        <div className="resume-header-info">
          {/* <h1>Resume Builder</h1> */}
        </div>
        <div className="resume-header-actions">
          <button
            onClick={handleOpenTemplateModal}
            className="resume-btn resume-btn-preview"
          >
            Preview
          </button>
          <button
            onClick={handleDownloadWord}
            className="resume-btn resume-btn-word"
            disabled={isDownloadingWord}
          >
            {isDownloadingWord ? "Generating..." : "Download Word"}
          </button>

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

          <div className="step-container">
            {renderForm()}
            <div className="step-navigation">
              {/* Previous */}
              <button
                className="step-nav-btn step-nav-prev"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <FaArrowLeft /> Previous
              </button>

              {/* Step Indicator */}
              <span className="step-progress">
                Step {currentStep + 1} of {steps.length}
              </span>

              {/* Right Actions */}
              <div className="step-actions">
                {/* Save Section */}
                <button
                  className="step-nav-btn step-nav-save"
                  onClick={saveCurrentSection}
                  disabled={isSavingSection}
                >
                  {isSavingSection ? "Saving..." : "Save Section"}
                </button>

                {/* Next */}
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
        </div>

        <div className="builder-right">
          <div id="print-container" ref={resumeDownloadRef}>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>

      <TemplateModal
        show={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        selectedTemplate={selectedTemplate}
        previewTemplate={previewTemplate}
        onTemplateSelect={handleTemplateSelect}
        onApplyTemplate={handleApplyTemplate}
      />

      <ExtraSectionsModal
        show={showExtraModal}
        onClose={() => setShowExtraModal(false)}
        onAddExtra={handleAddExtra}
      />
      <ShareModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareableUrl={shareableUrl}
        // onCopyUrl={copyToClipboard}
        onDownloadPdf={handleDownload}
        isDownloading={isDownloading}
      />
    </div>
  );
}

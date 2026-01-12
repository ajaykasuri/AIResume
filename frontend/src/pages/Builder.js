import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import html2pdf from "html2pdf.js";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
import ManageSectionsModal from "../components/ManageSectionsModal";

import { sectionAPI, resumeAPI, summaryAPI } from "../utils/api";

// Constants
const STEPS = [
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

const STEP_TO_BACKEND_MAP = {
  basics: "personal_info",
  personal: "profile",
  experience: "experience",
  education: "education",
  skills: "skills",
  projects: "projects",
  declaration: "declarations",
};

const EXTRA_SECTION_MAP = {
  achievements: "achievements",
  certifications: "certifications",
  awards: "awards",
  languages: "languages",
  interests: "interests",
};

const INITIAL_RESUME_STATE = {
  title: "My Resume",
  templateId: 1,
  template: "Classic",
  sectionsOrder: Object.keys(SECTION_MAP),
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
    achievements: [],
    certifications: [],
    awards: [],
    languages: [],
    interests: [],
  },
};

const TEMPLATES = [
  { id: 1, name: "Classic", img: ClassicTemplate },
  { id: 2, name: "Modern", img: ModernTemplate },
  { id: 3, name: "Executive", img: ExecutiveTemplate },
  { id: 4, name: "Elegant", img: ElegantTemplate },
];

// Utility Functions
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[\+]?[1-9][\d]{0,15}$/.test(phone);

const formatDateForMySQL = (dateString) => {
  if (!dateString) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  if (typeof dateString === "string" && dateString.includes("T")) {
    return dateString.split("T")[0];
  }
  if (dateString instanceof Date) {
    return dateString.toISOString().split("T")[0];
  }
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

export default function Builder({ token }) {
  // State Management
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isFresher, setIsFresher] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [previewTemplate, setPreviewTemplate] = useState(1);
  const [visibleExtraSections, setVisibleExtraSections] = useState([]);
  const [extraSections, setExtraSections] = useState([]); // Initialize as empty array
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [userSections, setUserSections] = useState([]);
  const [resume, setResume] = useState(INITIAL_RESUME_STATE);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showManageSectionsModal, setShowManageSectionsModal] = useState(false);

  const navigate = useNavigate();
  const resumeDownloadRef = useRef();
  const location = useLocation();
  const { resume_id } = useParams();
  const saveTimeoutRef = useRef(null);

  // All available sections for "Manage Sections" feature
  const allAvailableSections = useMemo(
    () => [
      { key: "personal_info", name: "Personal Information", stepId: "basics" },
      { key: "profile", name: "Profile Summary", stepId: "personal" },
      { key: "experience", name: "Experience", stepId: "experience" },
      { key: "education", name: "Education", stepId: "education" },
      { key: "skills", name: "Skills", stepId: "skills" },
      { key: "projects", name: "Projects", stepId: "projects" },
      { key: "declarations", name: "Declarations", stepId: "declaration" },
      {
        key: "certifications",
        name: "Certifications",
        stepId: "certifications",
      },
      { key: "achievements", name: "Achievements", stepId: "achievements" },
      { key: "awards", name: "Awards", stepId: "awards" },
      { key: "languages", name: "Languages", stepId: "languages" },
      { key: "interests", name: "Interests", stepId: "interests" },
    ],
    []
  );

  // Memoized filtered steps
  const filteredSteps = useMemo(() => {
    if (userSections.length === 0) return STEPS;
    return STEPS.filter((step) => {
      const backendKey = STEP_TO_BACKEND_MAP[step.id];
      return userSections.includes(backendKey);
    });
  }, [userSections]);

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    const totalSteps = filteredSteps.length;
    const completed = completedSteps.size;
    const percentage =
      totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0;
    return percentage;
  }, [filteredSteps.length, completedSteps.size]);

  // Update completion percentage when dependencies change
  useEffect(() => {
    const newCompletion = calculateCompletion();
    setCompletionPercentage(newCompletion);
  }, [calculateCompletion]);

  // Section data formatter
  const getSectionDataForBackend = useCallback(
    (sectionId) => {
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
          if (isFresher) {
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
          const validExperience = resume.data.experience.filter(
            (exp) => exp.title?.trim() && exp.employer?.trim() && exp.from
          );
          return validExperience.map(({ id, exp_id, ...exp }) => ({
            is_fresher: false,
            title: exp.title,
            employer: exp.employer,
            from: formatDateForMySQL(exp.from),
            to: formatDateForMySQL(exp.to),
            current: exp.current,
            description: exp.description,
          }));
        },
        projects: () => {
          const validProjects = resume.data.projects.filter(
            (proj) => proj.title?.trim() || proj.description?.trim()
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
          const validEducation = resume.data.education.filter(
            (edu) => edu.degree?.trim() || edu.institution?.trim()
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
          const validCerts = resume.data.certifications.filter((cert) =>
            cert.name?.trim()
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
          const validAchievements = resume.data.achievements.filter((ach) =>
            ach.title?.trim()
          );
          if (validAchievements.length === 0) return null;
          return validAchievements.map(({ id, ...ach }) => ({
            title: ach.title,
            achievement_date: formatDateForMySQL(ach.date),
            description: ach.description,
            category: ach.category,
            issuer: ach.issuer,
            achievement_url: ach.link,
          }));
        },
        awards: () => {
          const validAwards = resume.data.awards.filter((award) =>
            award.title?.trim()
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
          const validLanguages = resume.data.languages.filter((lang) =>
            lang.name?.trim()
          );
          if (validLanguages.length === 0) return null;
          return validLanguages.map(({ id, ...lang }) => ({
            language_name: lang.name,
            proficiency_level: lang.proficiency,
            certificate: lang.certificate,
          }));
        },
        interests: () => {
          const validInterests = resume.data.interests.filter((interest) =>
            interest.name?.trim()
          );
          if (validInterests.length === 0) return null;
          return validInterests.map(({ id, ...interest }) => ({
            interest_name: interest.name,
            description: interest.description,
          }));
        },
      };

      return formatters[sectionId] ? formatters[sectionId]() : null;
    },
    [resume.data, isFresher]
  );

  // Debounced auto-save
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // saveTimeoutRef.current = setTimeout(async () => {
    //   const editingId = localStorage.getItem("editingResumeId");
    //   if (editingId && hasUnsavedChanges) {
    //     await handleSave(true); // silent save
    //     setHasUnsavedChanges(false);
    //   }
    // }, 3000);
  }, [hasUnsavedChanges]);

  // Mark resume as changed
  useEffect(() => {
    if (resumeId) {
      setHasUnsavedChanges(true);
      debouncedSave();
    }
  }, [resume, debouncedSave, resumeId]);

  // Load resume
  const loadResume = useCallback(
    async (id, isReload = false) => {
      if (!id || location.state?.isFromAI) return;

      try {
        if (!isReload) setIsLoading(true);

        const { data } = await resumeAPI.getFullResume(id);
  

        if (data) {
          const selectedSectionKeys = data.sections.map(
            (section) => section.section_key
          );
          // console.log("Loaded sections:", selectedSectionKeys);
          setUserSections(selectedSectionKeys);

          const sectionsOrder = selectedSectionKeys
            .map((key) => {
              const keyToStepMap = {
                personal_info: "basics",
                skills: "skills",
                experience: "experience",
                projects: "projects",
                profile: "personal",
                education: "education",
                declarations: "declaration",
              };
              return keyToStepMap[key];
            })
            .filter(Boolean);

          const content = data.content;
          const hasFresherExperience =
            content.experience?.some((exp) => exp.is_fresher === 1) || false;
          setIsFresher(hasFresherExperience);

          const transformedData = transformBackendToFrontend(
            content,
            selectedSectionKeys,
            data.resume,
            sectionsOrder
          );

          setResume(transformedData);
          setSelectedTemplate(data.resume?.template_id || 1);
          setPreviewTemplate(data.resume?.template_id || 1);
          setCompletionPercentage(data.resume?.completion_percentage || 0);
          updateVisibleExtraSections(selectedSectionKeys);

          const newCompletedSteps = new Set();
          STEPS.forEach((step) => {
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
    },
    [location.state?.isFromAI]
  );

  // Transform backend data to frontend format
  const transformBackendToFrontend = (
    backendData,
    selectedSectionKeys,
    resumeData,
    sectionsOrder
  ) => {
    return {
      ...INITIAL_RESUME_STATE,
      resume_id: resumeData?.resume_id,
      title: resumeData?.resume_name || "My Resume",
      templateId: resumeData?.template_id || 1,
      template: resumeData?.template_name || "Classic",
      sectionsOrder: sectionsOrder || INITIAL_RESUME_STATE.sectionsOrder,
      data: {
        ...INITIAL_RESUME_STATE.data,
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
          : INITIAL_RESUME_STATE.data.basics,
        personalStatement: backendData.personalstatements?.[0]?.content || "",
        skills: backendData.skills?.map((skill) => skill.skill_name) || [],
        experience:
          backendData.experience
            ?.filter(
              (exp) => !exp.is_fresher && exp.job_title && exp.company_name
            )
            .map((exp) => ({
              exp_id: exp.exp_id,
              id: exp.exp_id || Date.now(),
              title: exp.job_title || "",
              employer: exp.company_name || "",
              from: exp.start_date || "",
              to: exp.end_date || "",
              current: exp.is_current_job || false,
              description: exp.description || "",
            })) || [],
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
        education:
          backendData.education?.map((edu) => ({
            id: edu.education_id || Date.now(),
            degree: edu.degree || "",
            institution: edu.institution_name || "",
            from: edu.start_date || "",
            to: edu.end_date || "",
            current: edu.is_current_education || false,
          })) || [],
        declaration: backendData.declarations?.[0]
          ? {
              description: backendData.declarations[0].description || "",
              signature: backendData.declarations[0].signature || "",
            }
          : INITIAL_RESUME_STATE.data.declaration,
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
  };

  // Validate step data
  const validateStepData = (stepId, resumeData) => {
    switch (stepId) {
      case "basics":
        const { name, jobTitle, email, phone } = resumeData.data.basics;
        return name && jobTitle && validateEmail(email) && validatePhone(phone);
      case "skills":
        return resumeData.data.skills.length > 0;
      case "experience":
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

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    if (filteredSteps.length === 0) return false;
    const stepId = filteredSteps[currentStep].id;
    return validateStepData(stepId, resume);
  }, [filteredSteps, currentStep, resume, isFresher]);

  // Auto-mark step as completed
  useEffect(() => {
    if (validateCurrentStep()) {
      setCompletedSteps((prev) =>
        new Set(prev).add(filteredSteps[currentStep].id)
      );
    }
  }, [validateCurrentStep, currentStep, filteredSteps]);

  // Update visible extra sections
  const updateVisibleExtraSections = (selectedSectionKeys) => {
    const visibleExtras = [];
    Object.entries(EXTRA_SECTION_MAP).forEach(([key, value]) => {
      if (selectedSectionKeys.includes(key)) {
        visibleExtras.push(value.charAt(0).toUpperCase() + value.slice(1));
      }
    });
    setVisibleExtraSections(visibleExtras);
  };

  // Delete section item
  const deleteSectionItem = async (section, id) => {
    try {
      const editingId = localStorage.getItem("editingResumeId");
      if (!editingId) return true;

      await sectionAPI.deleteItem(editingId, section, id);
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Failed to delete ${section} item`);
      return false;
    }
  };

  // Main save function
  const handleSave = async (silent = false) => {
    try {
      const editingId = localStorage.getItem("editingResumeId");
      if (!editingId) {
        toast.error("No resume ID found");
        return false;
      }

      const sectionsData = {};

      // Prepare sections data
      filteredSteps.forEach((step) => {
        const backendSection = SECTION_MAP[step.id];
        if (backendSection) {
          const data = getSectionDataForBackend(step.id);
          if (data) sectionsData[backendSection] = data;
        }
      });

      // Add extra sections
      Object.keys(EXTRA_SECTION_MAP).forEach((key) => {
        if (userSections.includes(key)) {
          const data = getSectionDataForBackend(key);
          if (data) sectionsData[key] = data;
        }
      });

      if (Object.keys(sectionsData).length === 0) {
        if (!silent) toast.error("No sections to save");
        return false;
      }

      // Bulk save sections
      await sectionAPI.bulkSave(editingId, sectionsData);

      // Update resume metadata
      await resumeAPI.update(editingId, {
        resume_name: resume.data.basics.name || "My Resume",
        template_id: resume.templateId,
        completion_percentage: calculateCompletion(),
        last_updated: new Date().toISOString(),
      });

      if (!silent) toast.success("Resume saved successfully!");
      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      console.error("Save failed:", error);
      if (!silent) toast.error("Failed to save resume");
      return false;
    }
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Resume data handlers (optimized versions)
  const updateBasics = useCallback((field, value) => {
    setResume((r) => ({
      ...r,
      data: { ...r.data, basics: { ...r.data.basics, [field]: value } },
    }));
  }, []);

  const addSkill = useCallback((s) => {
    if (!s.trim()) return;
    setResume((r) => ({
      ...r,
      data: { ...r.data, skills: [...r.data.skills, s.trim()] },
    }));
  }, []);

  const removeSkill = useCallback((i) => {
    setResume((r) => ({
      ...r,
      data: { ...r.data, skills: r.data.skills.filter((_, idx) => idx !== i) },
    }));
  }, []);

  const addExperience = useCallback(() => {
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
  }, []);

  const updateExperience = useCallback((id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        experience: r.data.experience.map((exp) =>
          exp.id === id ? { ...exp, [field]: value } : exp
        ),
      },
    }));
  }, []);

  const deleteExperience = useCallback(
    async (id) => {
      const experienceItem = resume.data.experience.find(
        (exp) => exp.id === id || exp.exp_id === id
      );
      if (!experienceItem) return;

      if (isFresher && resume.data.experience.length === 1) {
        toast.error(
          "Cannot delete experience record for freshers. Please uncheck 'I'm a fresher' first."
        );
        return;
      }

      setResume((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          experience: prev.data.experience.filter(
            (e) => e.id !== id && e.exp_id !== id
          ),
        },
      }));

      if (experienceItem.exp_id) {
        try {
          await deleteSectionItem("experience", experienceItem.exp_id);
          toast.success("Experience deleted successfully!");
        } catch (error) {
          console.error("Failed to delete experience:", error);
          await loadResume(resume.resume_id, true);
        }
      }
    },
    [resume.data.experience, isFresher, resume.resume_id, loadResume]
  );

  // Similar optimizations for other CRUD operations...
  // (I'll include key ones, you can apply the same pattern to others)

  const addProject = useCallback(() => {
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
      skillsUsed: [],
    };
    setResume((r) => ({
      ...r,
      data: { ...r.data, projects: [...r.data.projects, newProj] },
    }));
  }, []);

  const updateProject = useCallback((id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        projects: r.data.projects.map((proj) =>
          proj.id === id ? { ...proj, [field]: value } : proj
        ),
      },
    }));
  }, []);

  const deleteProject = useCallback(
    async (id) => {
      const editingId = localStorage.getItem("editingResumeId");
      const projectItem = resume.data.projects.find((p) => p.id === id);
      if (!projectItem) return;

      setResume((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          projects: prev.data.projects.filter((p) => p.id !== id),
        },
      }));

      if (projectItem.id) {
        try {
          await deleteSectionItem("projects", projectItem.id);
          toast.success("Project deleted successfully!");
        } catch (error) {
          console.error("Failed to delete project:", error);
          await loadResume(editingId, true);
        }
      }
    },
    [resume.data.projects, loadResume]
  );

  // Extra section handlers
  const addAchievement = useCallback(() => {
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
  }, []);

  const updateAchievement = useCallback((id, field, value) => {
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
  }, []);

  const deleteAchievement = useCallback(
    async (id) => {
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

      if (editingId && achievementItem?.title) {
        try {
          await deleteSectionItem("achievements", id);
          toast.success("Achievement deleted successfully!");
        } catch (error) {
          console.error("Failed to delete achievement:", error);
          await loadResume(editingId, true);
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
    },
    [resume.data.achievements, loadResume]
  );

  const addCertification = useCallback(() => {
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
  }, []);

  const updateCertification = useCallback((id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        certifications: r.data.certifications.map((cert) =>
          cert.id === id ? { ...cert, [field]: value } : cert
        ),
      },
    }));
  }, []);

  const deleteCertification = useCallback(
    async (id) => {
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

      if (editingId && certificationItem?.name) {
        try {
          await deleteSectionItem("certifications", id);
          toast.success("Certification deleted successfully!");
        } catch (error) {
          console.error("Failed to delete certification:", error);
          await loadResume(editingId, true);
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
    },
    [resume.data.certifications, loadResume]
  );

  const addAward = useCallback(() => {
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
  }, []);

  const updateAward = useCallback((id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        awards: r.data.awards.map((award) =>
          award.id === id ? { ...award, [field]: value } : award
        ),
      },
    }));
  }, []);

  const deleteAward = useCallback(
    async (id) => {
      const awardItem = resume.data.awards.find((award) => award.id === id);
      const editingId = localStorage.getItem("editingResumeId");

      setResume((r) => ({
        ...r,
        data: {
          ...r.data,
          awards: r.data.awards.filter((a) => a.id !== id),
        },
      }));

      if (editingId && awardItem?.title) {
        try {
          await deleteSectionItem("awards", id);
          toast.success("Award deleted successfully!");
        } catch (error) {
          console.error("Failed to delete award:", error);
          await loadResume(editingId, true);
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
    },
    [resume.data.awards, loadResume]
  );

  const addLanguage = useCallback(() => {
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
  }, []);

  const updateLanguage = useCallback((id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        languages: r.data.languages.map((lang) =>
          lang.id === id ? { ...lang, [field]: value } : lang
        ),
      },
    }));
  }, []);

  const deleteLanguage = useCallback(
    async (id) => {
      const languageItem = resume.data.languages.find((lang) => lang.id === id);
      const editingId = localStorage.getItem("editingResumeId");

      setResume((r) => ({
        ...r,
        data: {
          ...r.data,
          languages: r.data.languages.filter((l) => l.id !== id),
        },
      }));

      if (editingId && languageItem?.name) {
        try {
          await deleteSectionItem("languages", id);
          toast.success("Language deleted successfully!");
        } catch (error) {
          console.error("Failed to delete language:", error);
          await loadResume(editingId, true);
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
    },
    [resume.data.languages, loadResume]
  );

  const addInterest = useCallback(() => {
    const newInterest = {
      id: Date.now(),
      name: "",
      description: "",
    };
    setResume((r) => ({
      ...r,
      data: { ...r.data, interests: [...r.data.interests, newInterest] },
    }));
  }, []);

  const updateInterest = useCallback((id, field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        interests: r.data.interests.map((interest) =>
          interest.id === id ? { ...interest, [field]: value } : interest
        ),
      },
    }));
  }, []);

  const deleteInterest = useCallback(
    async (id) => {
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

      if (editingId && interestItem?.name) {
        try {
          await deleteSectionItem("interests", id);
          toast.success("Interest deleted successfully!");
        } catch (error) {
          console.error("Failed to delete interest:", error);
          await loadResume(editingId, true);
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
    },
    [resume.data.interests, loadResume]
  );

  const handleDeleteExtra = useCallback((id) => {
    setExtraSections((prev) => prev.filter((s) => s.id !== id));
    setResume((r) => ({
      ...r,
      sectionsOrder: r.sectionsOrder.filter((s) => s !== `extra-${id}`),
    }));
  }, []);

  const updateExtraContent = useCallback((id, content) => {
    setExtraSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s))
    );
  }, []);

  const handleSaveExtraSection = async (sectionType) => {
    try {
      const backendSection = EXTRA_SECTION_MAP[sectionType.toLowerCase()];
      const formattedData = getSectionDataForBackend(sectionType.toLowerCase());

      if (!formattedData || formattedData.length === 0) {
        toast.error(`No ${sectionType} data to save`);
        return false;
      }

      const editingId = localStorage.getItem("editingResumeId");
      if (!editingId) {
        toast.error("Please save the resume first");
        return false;
      }

      await sectionAPI.save(editingId, backendSection, formattedData);
      toast.success(`${sectionType} saved successfully!`);
      return true;
    } catch (error) {
      console.error(`Failed to save ${sectionType}:`, error);
      toast.error(`Failed to save ${sectionType}`);
      return false;
    }
  };

  const updatePersonalStatement = useCallback((value) => {
    setResume((r) => ({
      ...r,
      data: { ...r.data, personalStatement: value },
    }));
  }, []);

  const updateDeclaration = useCallback((field, value) => {
    setResume((r) => ({
      ...r,
      data: {
        ...r.data,
        declaration: { ...r.data.declaration, [field]: value },
      },
    }));
  }, []);

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
      toast.error("Failed to generate project summary.");
    }
  };

  // Template handlers
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setPreviewTemplate(templateId);
  };

  const handleApplyTemplate = async () => {
    const selectedTemplateData = TEMPLATES.find(
      (t) => t.id === selectedTemplate
    );
    setResume((prev) => ({
      ...prev,
      templateId: selectedTemplate,
      template: selectedTemplateData?.name || "Classic",
    }));

    const editingId = localStorage.getItem("editingResumeId");
    if (editingId) {
      try {
        await resumeAPI.update(editingId, {
          template_id: selectedTemplate,
          last_updated: new Date().toISOString(),
        });
        toast.success(`${selectedTemplateData?.name} template applied!`);
      } catch (error) {
        console.error("Failed to save template:", error);
        toast.error("Template applied but failed to save");
      }
    }
    setShowTemplateModal(false);
  };

  // Manage sections functionality
  const handleUpdateSections = async (newSections) => {
    try {
      const editingId = localStorage.getItem("editingResumeId");
      if (!editingId) {
        toast.error("No resume found");
        return;
      }

      await resumeAPI.updateSections(editingId, {
        selectedSections: newSections,
        last_updated: new Date().toISOString(),
      });
      // Update local state
      setUserSections(newSections);
      toast.success("Sections updated successfully!");

      // Reload resume to reflect changes
      // await loadResume(editingId, true);

      setShowManageSectionsModal(false);
    } catch (error) {
      console.error("Failed to update sections:", error);
      toast.error("Failed to update sections");
    }
  };

  // Download handlers
  const validateResume = () => {
    const { basics, skills, education } = resume.data;

    const requiredBasicsFields = ["name", "jobTitle", "email", "phone"];
    for (const field of requiredBasicsFields) {
      if (!basics[field]?.trim()) {
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

    if (!isFresher && resume.data.experience.length === 0) {
      toast.error("Please add at least one work experience or mark as fresher");
      return false;
    }

    return true;
  };

  const handleDownload = async () => {
    if (!validateResume()) return;
    const element = resumeDownloadRef.current;
    if (!element) return toast.error("Failed to generate PDF");

    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF…");

    try {
      await handleSave(true);
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

  const handleDownloadWord = async () => {
    if (!validateResume()) return;
    setIsDownloadingWord(true);
    const toastId = toast.loading("Generating Word document...");

    try {
      await handleSave(true);
      const fileName = `${resume.data.basics.name || "resume"}.doc`;
      await exportToWord(resumeDownloadRef, fileName);
      toast.success("Word document downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Word download error:", error);
      toast.error("Failed to generate Word document", { id: toastId });
    } finally {
      setIsDownloadingWord(false);
    }
  };

  // Initialize resume
  useEffect(() => {
    const initializeResume = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const resumeIdFromUrl =
        resume_id || urlParams.get("resumeId") || urlParams.get("editId");

      if (resumeIdFromUrl) {
        localStorage.setItem("editingResumeId", resumeIdFromUrl);
        setResumeId(resumeIdFromUrl);
        return resumeIdFromUrl;
      }
      return null;
    };

    const resumeIdToLoad = initializeResume();
    if (resumeIdToLoad && !location.state?.isFromAI) {
      loadResume(resumeIdToLoad);
    }
  }, [resume_id, location.state, loadResume]);

  // Handle AI-generated data
  useEffect(() => {
    if (location.state?.isFromAI && location.state?.aiGeneratedData) {
      const aiData = location.state.aiGeneratedData;

      setResume((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          basics: {
            ...prev.data.basics,
            name: aiData.basics.name || prev.data.basics.name,
            jobTitle: aiData.basics.jobTitle || prev.data.basics.jobTitle,
            email: aiData.basics.email || prev.data.basics.email,
            phone: aiData.basics.phone || prev.data.basics.phone,
          },
          personalStatement:
            aiData.personalStatement || prev.data.personalStatement,
          skills:
            aiData.skills?.length > 0 ? [...aiData.skills] : prev.data.skills,
          projects:
            aiData.projects?.length > 0
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
              aiData.declaration?.signature || prev.data.declaration.signature,
          },
        },
      }));

      const newCompletedSteps = new Set();
      if (aiData.basics.name && aiData.basics.jobTitle)
        newCompletedSteps.add("basics");
      if (aiData.skills?.length > 0) newCompletedSteps.add("skills");
      if (aiData.projects?.length > 0) newCompletedSteps.add("projects");
      if (aiData.personalStatement) newCompletedSteps.add("personal");
      if (aiData.declaration?.description) newCompletedSteps.add("declaration");

      setCompletedSteps(newCompletedSteps);
      setCurrentStep(0);
    }
  }, [location.state]);

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

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Render form based on current step
  const renderForm = () => {
    if (filteredSteps.length === 0) {
      return <div>Loading sections...</div>;
    }

    const stepId = filteredSteps[currentStep].id;
    const formProps = {
      resume,
      isFresher,
      setIsFresher,
    };

    switch (stepId) {
      case "basics":
        return <BasicsForm {...formProps} updateBasics={updateBasics} />;
      case "skills":
        return (
          <SkillsForm
            {...formProps}
            addSkill={addSkill}
            removeSkill={removeSkill}
          />
        );
      case "experience":
        return (
          <ExperienceForm
            {...formProps}
            addExperience={addExperience}
            updateExperience={updateExperience}
            deleteExperience={deleteExperience}
          />
        );
      case "projects":
        return (
          <ProjectsForm
            {...formProps}
            addProject={addProject}
            updateProject={updateProject}
            deleteProject={deleteProject}
            addProjectSkill={(projectId, skill) => {
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
            }}
            removeProjectSkill={(projectId, skillIndex) => {
              setResume((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  projects: prev.data.projects.map((proj) =>
                    proj.id === projectId
                      ? {
                          ...proj,
                          skillsUsed: proj.skillsUsed.filter(
                            (_, i) => i !== skillIndex
                          ),
                        }
                      : proj
                  ),
                },
              }));
            }}
            handleGenerateProjectSummary={handleGenerateProjectSummary}
          />
        );
      case "personal":
        return (
          <SummaryForm
            {...formProps}
            updatePersonalStatement={updatePersonalStatement}
            handleGenerateSummary={handleGenerateSummary}
          />
        );
      case "education":
        return (
          <EducationForm
            {...formProps}
            addEducation={() => {
              setResume((r) => ({
                ...r,
                data: {
                  ...r.data,
                  education: [
                    ...r.data.education,
                    {
                      id: Date.now(),
                      degree: "",
                      institution: "",
                      from: "",
                      to: "",
                      current: false,
                    },
                  ],
                },
              }));
            }}
            updateEducation={(id, field, value) => {
              setResume((r) => ({
                ...r,
                data: {
                  ...r.data,
                  education: r.data.education.map((edu) =>
                    edu.id === id ? { ...edu, [field]: value } : edu
                  ),
                },
              }));
            }}
            deleteEducation={(id) => {
              setResume((r) => ({
                ...r,
                data: {
                  ...r.data,
                  education: r.data.education.filter((e) => e.id !== id),
                },
              }));
            }}
          />
        );
      case "declaration":
        return (
          <DeclarationForm
            resume={resume}
            isFresher={isFresher}
            updateDeclaration={updateDeclaration}
            visibleExtraSections={visibleExtraSections || []}
            extraSections={extraSections || []}
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
          {hasUnsavedChanges && (
            <span className="unsaved-indicator">• Unsaved changes</span>
          )}
        </div>
        <div className="resume-header-actions">
          <button
            onClick={() => setShowManageSectionsModal(true)}
            className="resume-btn resume-btn-sections"
            title="Add or remove sections"
          >
            Manage Sections
          </button>
          <button
            onClick={() => {
              setPreviewTemplate(resume.templateId);
              setSelectedTemplate(resume.templateId);
              setShowTemplateModal(true);
            }}
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
          <button
            onClick={handleDownload}
            className="resume-btn resume-btn-download"
            disabled={isDownloading}
          >
            {isDownloading ? "Generating..." : "Download PDF"}
          </button>
          <button
            onClick={() => handleSave(false)}
            className="resume-btn resume-btn-save"
          >
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
            {userSections.length > 0 && (
              <div className="selected-sections-info">
                <small>
                  Showing {filteredSteps.length} of {STEPS.length} sections
                </small>
              </div>
            )}
          </div>

          <div className="step-container">
            {renderForm()}
            <div className="step-navigation">
              <button
                className="step-nav-btn step-nav-prev"
                onClick={prevStep}
                disabled={currentStep === 0 || filteredSteps.length === 0}
              >
                <FaArrowLeft /> Previous
              </button>

              <span className="step-progress">
                Step {filteredSteps.length > 0 ? currentStep + 1 : 0} of{" "}
                {filteredSteps.length}
              </span>

              <button
                className="step-nav-btn step-nav-next"
                onClick={nextStep}
                disabled={
                  currentStep === filteredSteps.length - 1 ||
                  filteredSteps.length === 0
                }
              >
                Next <FaArrowRight />
              </button>
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
        onAddExtra={(type) => {
          setVisibleExtraSections((prev) => {
            if (!prev.includes(type)) return [...prev, type];
            return prev;
          });

          // Add the appropriate section based on type
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
        }}
      />

      {/* Manage Sections Modal */}
      {showManageSectionsModal && (
        <ManageSectionsModal
          currentSections={userSections}
          availableSections={allAvailableSections}
          onClose={() => setShowManageSectionsModal(false)}
          onUpdate={handleUpdateSections}
        />
      )}
    </div>
  );
}

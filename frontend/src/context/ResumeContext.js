// context/ResumeContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResumeContext = createContext();

// Initial state
const initialState = {
  resume: {
    title: "My Resume",
    templateId: 1,
    template: "Classic",
    sectionsOrder: [
      "basics", "skills", "experience", "projects", 
      "personal", "education", "declaration"
    ],
    data: {
      basics: {
        name: "", jobTitle: "", email: "", phone: "",
        city: "", country: "", linkedIn: "", github: "", website: ""
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
  },
  currentStep: 0,
  completedSteps: new Set(),
  isFresher: false,
  isSaving: false,
  isDownloading: false,
  isLoading: false,
  editingResumeId: null,
  completionPercentage: 0,
  selectedTemplate: 1,
  previewTemplate: 1,
  visibleExtraSections: [],
  shareableUrl: "",
  isGeneratingShareUrl: false,
};

// Action types
const ACTION_TYPES = {
  SET_RESUME: 'SET_RESUME',
  UPDATE_BASICS: 'UPDATE_BASICS',
  ADD_SKILL: 'ADD_SKILL',
  REMOVE_SKILL: 'REMOVE_SKILL',
  ADD_EXPERIENCE: 'ADD_EXPERIENCE',
  UPDATE_EXPERIENCE: 'UPDATE_EXPERIENCE',
  DELETE_EXPERIENCE: 'DELETE_EXPERIENCE',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  ADD_EDUCATION: 'ADD_EDUCATION',
  UPDATE_EDUCATION: 'UPDATE_EDUCATION',
  DELETE_EDUCATION: 'DELETE_EDUCATION',
  UPDATE_DECLARATION: 'UPDATE_DECLARATION',
  UPDATE_PERSONAL_STATEMENT: 'UPDATE_PERSONAL_STATEMENT',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_COMPLETED_STEPS: 'SET_COMPLETED_STEPS',
  SET_IS_FRESHER: 'SET_IS_FRESHER',
  SET_SAVING: 'SET_SAVING',
  SET_LOADING: 'SET_LOADING',
  SET_EDITING_ID: 'SET_EDITING_ID',
  SET_COMPLETION_PERCENTAGE: 'SET_COMPLETION_PERCENTAGE',
  SET_TEMPLATE: 'SET_TEMPLATE',
  SET_VISIBLE_SECTIONS: 'SET_VISIBLE_SECTIONS',
  ADD_ACHIEVEMENT: 'ADD_ACHIEVEMENT',
  UPDATE_ACHIEVEMENT: 'UPDATE_ACHIEVEMENT',
  DELETE_ACHIEVEMENT: 'DELETE_ACHIEVEMENT',
  ADD_CERTIFICATION: 'ADD_CERTIFICATION',
  UPDATE_CERTIFICATION: 'UPDATE_CERTIFICATION',
  DELETE_CERTIFICATION: 'DELETE_CERTIFICATION',
  ADD_AWARD: 'ADD_AWARD',
  UPDATE_AWARD: 'UPDATE_AWARD',
  DELETE_AWARD: 'DELETE_AWARD',
  ADD_LANGUAGE: 'ADD_LANGUAGE',
  UPDATE_LANGUAGE: 'UPDATE_LANGUAGE',
  DELETE_LANGUAGE: 'DELETE_LANGUAGE',
  ADD_INTEREST: 'ADD_INTEREST',
  UPDATE_INTEREST: 'UPDATE_INTEREST',
  DELETE_INTEREST: 'DELETE_INTEREST',
};

// Reducer
const resumeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_RESUME:
      return {
        ...state,
        resume: action.payload,
      };

    case ACTION_TYPES.UPDATE_BASICS:
      return {
        ...state,
        resume: {
          ...state.resume,
          data: {
            ...state.resume.data,
            basics: {
              ...state.resume.data.basics,
              [action.payload.field]: action.payload.value,
            },
          },
        },
      };

    case ACTION_TYPES.ADD_SKILL:
      return {
        ...state,
        resume: {
          ...state.resume,
          data: {
            ...state.resume.data,
            skills: [...state.resume.data.skills, action.payload],
          },
        },
      };

    case ACTION_TYPES.REMOVE_SKILL:
      return {
        ...state,
        resume: {
          ...state.resume,
          data: {
            ...state.resume.data,
            skills: state.resume.data.skills.filter((_, idx) => idx !== action.payload),
          },
        },
      };

    case ACTION_TYPES.ADD_EXPERIENCE:
      return {
        ...state,
        resume: {
          ...state.resume,
          data: {
            ...state.resume.data,
            experience: [
              ...state.resume.data.experience,
              {
                id: Date.now(),
                title: "",
                employer: "",
                from: "",
                to: "",
                current: false,
                description: "",
              },
            ],
          },
        },
      };

    case ACTION_TYPES.UPDATE_EXPERIENCE:
      return {
        ...state,
        resume: {
          ...state.resume,
          data: {
            ...state.resume.data,
            experience: state.resume.data.experience.map((exp) =>
              exp.id === action.payload.id
                ? { ...exp, [action.payload.field]: action.payload.value }
                : exp
            ),
          },
        },
      };

    case ACTION_TYPES.DELETE_EXPERIENCE:
      return {
        ...state,
        resume: {
          ...state.resume,
          data: {
            ...state.resume.data,
            experience: state.resume.data.experience.filter(
              (e) => e.id !== action.payload
            ),
          },
        },
      };

    case ACTION_TYPES.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };

    case ACTION_TYPES.SET_COMPLETED_STEPS:
      return {
        ...state,
        completedSteps: action.payload,
      };

    case ACTION_TYPES.SET_IS_FRESHER:
      return {
        ...state,
        isFresher: action.payload,
      };

    case ACTION_TYPES.SET_SAVING:
      return {
        ...state,
        isSaving: action.payload,
      };

    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ACTION_TYPES.SET_EDITING_ID:
      return {
        ...state,
        editingResumeId: action.payload,
      };

    case ACTION_TYPES.SET_COMPLETION_PERCENTAGE:
      return {
        ...state,
        completionPercentage: action.payload,
      };

    case ACTION_TYPES.SET_TEMPLATE:
      return {
        ...state,
        selectedTemplate: action.payload,
        previewTemplate: action.payload,
        resume: {
          ...state.resume,
          templateId: action.payload,
          template: action.payload === 1 ? "Classic" : 
                   action.payload === 2 ? "Modern" :
                   action.payload === 3 ? "Executive" : "Elegant",
        },
      };

    // Add similar cases for other actions (projects, education, etc.)

    default:
      return state;
  }
};

// Context Provider
export const ResumeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  // Actions
  const actions = {
    // Resume data actions
    updateBasics: useCallback((field, value) => {
      dispatch({ type: ACTION_TYPES.UPDATE_BASICS, payload: { field, value } });
    }, []),

    addSkill: useCallback((skill) => {
      if (!skill.trim()) return;
      dispatch({ type: ACTION_TYPES.ADD_SKILL, payload: skill.trim() });
    }, []),

    removeSkill: useCallback((index) => {
      dispatch({ type: ACTION_TYPES.REMOVE_SKILL, payload: index });
    }, []),

    addExperience: useCallback(() => {
      dispatch({ type: ACTION_TYPES.ADD_EXPERIENCE });
    }, []),

    updateExperience: useCallback((id, field, value) => {
      dispatch({ type: ACTION_TYPES.UPDATE_EXPERIENCE, payload: { id, field, value } });
    }, []),

    deleteExperience: useCallback((id) => {
      dispatch({ type: ACTION_TYPES.DELETE_EXPERIENCE, payload: id });
    }, []),

    // Navigation actions
    setCurrentStep: useCallback((step) => {
      dispatch({ type: ACTION_TYPES.SET_CURRENT_STEP, payload: step });
    }, []),

    markStepCompleted: useCallback((stepId) => {
      const newCompletedSteps = new Set(state.completedSteps);
      newCompletedSteps.add(stepId);
      dispatch({ type: ACTION_TYPES.SET_COMPLETED_STEPS, payload: newCompletedSteps });
    }, [state.completedSteps]),

    setIsFresher: useCallback((isFresher) => {
      dispatch({ type: ACTION_TYPES.SET_IS_FRESHER, payload: isFresher });
    }, []),

    setTemplate: useCallback((templateId) => {
      dispatch({ type: ACTION_TYPES.SET_TEMPLATE, payload: templateId });
    }, []),

    // API actions
    loadResume: useCallback(async (resumeId, token) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      
      try {
        const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/resumes/${resumeId}`, opts);
        const resumeData = response.data;

        dispatch({ type: ACTION_TYPES.SET_RESUME, payload: resumeData });
        dispatch({ type: ACTION_TYPES.SET_EDITING_ID, payload: resumeId });
        
        // Restore completed steps
        const completedSteps = new Set();
        if (resumeData.data?.basics?.name && resumeData.data.basics?.email) {
          completedSteps.add("basics");
        }
        // Add other step validations...
        
        dispatch({ type: ACTION_TYPES.SET_COMPLETED_STEPS, payload: completedSteps });
        toast.success("Resume loaded successfully");
        
        return resumeData;
      } catch (error) {
        console.error("Failed to load resume:", error);
        toast.error("Failed to load resume");
        throw error;
      } finally {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
      }
    }, []),

    saveResume: useCallback(async (token, forceSave = false) => {
      if (state.isSaving && !forceSave) {
        toast.loading("Already saving...");
        return;
      }

      dispatch({ type: ACTION_TYPES.SET_SAVING, payload: true });
      const toastId = toast.loading("Saving resume...");

      try {
        const dataToSend = {
          ...state.resume,
          data: {
            ...state.resume.data,
            completionPercentage: state.completionPercentage,
            lastUpdated: new Date().toISOString(),
            isFresher: state.isFresher,
          },
        };

        const opts = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        let response;

        if (state.editingResumeId) {
          // Update existing
          response = await axios.put(
            `${process.env.REACT_APP_API_URL}/api/resumes/${state.editingResumeId}`,
            dataToSend,
            opts
          );
          toast.success("Updated successfully!", { id: toastId });
        } else {
          // Create new
          response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/resumes`,
            dataToSend,
            opts
          );
          
          if (response.data?.id) {
            dispatch({ type: ACTION_TYPES.SET_EDITING_ID, payload: response.data.id });
            toast.success("Saved successfully!", { id: toastId });
          }
        }

        return response.data;
      } catch (error) {
        console.error("Save error:", error);
        toast.error("Save failed", { id: toastId });
        throw error;
      } finally {
        dispatch({ type: ACTION_TYPES.SET_SAVING, payload: false });
      }
    }, [state.resume, state.isSaving, state.editingResumeId, state.completionPercentage, state.isFresher]),

    generateShareableUrl: useCallback(async (token) => {
      try {
        // First save the resume
        await actions.saveResume(token, true);
        
        if (!state.editingResumeId) {
          toast.error("Please save your resume first");
          return;
        }

        const shareUrl = `${window.location.origin}/view/${state.editingResumeId}`;
        return shareUrl;
      } catch (error) {
        toast.error("Failed to generate share URL");
        throw error;
      }
    }, [state.editingResumeId]),

    clearResume: useCallback(() => {
      dispatch({ type: ACTION_TYPES.SET_RESUME, payload: initialState.resume });
      dispatch({ type: ACTION_TYPES.SET_EDITING_ID, payload: null });
      dispatch({ type: ACTION_TYPES.SET_COMPLETED_STEPS, payload: new Set() });
      dispatch({ type: ACTION_TYPES.SET_CURRENT_STEP, payload: 0 });
    }, []),
  };

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    const totalSteps = 7; // basics, skills, experience, projects, personal, education, declaration
    const completed = state.completedSteps.size;
    const percentage = Math.round((completed / totalSteps) * 100);
    dispatch({ type: ACTION_TYPES.SET_COMPLETION_PERCENTAGE, payload: percentage });
    return percentage;
  }, [state.completedSteps.size]);

  // Auto-calculate completion when steps change
  React.useEffect(() => {
    calculateCompletion();
  }, [state.completedSteps, calculateCompletion]);

  const value = {
    ...state,
    ...actions,
    calculateCompletion,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook to use the context
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
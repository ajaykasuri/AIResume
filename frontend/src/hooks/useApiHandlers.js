import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import exportToWord from "../utils/wordExport";
import { sectionAPI, resumeAPI, summaryAPI } from "../utils/api";
import { getSectionDataForBackend, SECTION_MAP } from "../utils/resumeUtils";

export const useApiHandlers = (
  resume,
  setResume,
  setCompletionPercentage,
  setIsFresher,
  setUserSections,
  setIsLoading,
  token,
  steps,
  completedSteps
) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [isGeneratingShareUrl, setIsGeneratingShareUrl] = useState(false);
  const [shareableUrl, setShareableUrl] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  // Helper functions
  const handleApiError = (error, defaultMessage) => {
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
      const response = await resumeAPI.update(resumeId, {
        completion_percentage: currentCompletion,
        last_updated: new Date().toISOString(),
        template_id: resume.templateId,
      });

      setCompletionPercentage(currentCompletion);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Section-based API functions
  const saveSection = async (section, items) => {
    
    try {
      const editingId = localStorage.getItem("editingResumeId");

      if (!editingId) {
        return true;
      }
console.log("Saving section:", section, items);
      const response = await sectionAPI.save(editingId, section, items);

      // Update completion percentage
      await updateResumeCompletion(editingId);

      return true;
    } catch (error) {
      return handleApiError(error, `Failed to save ${section} section`);
    }
  };

  // Delete function to update completion
  const deleteSectionItem = async (section, id) => {
    try {
      const editingId = localStorage.getItem("editingResumeId");
      if (!editingId) {
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

  // Calculate completion percentage
  const calculateCompletion = () => {
    const totalSteps = steps.length;
    const completed = completedSteps.size;
    const percentage = Math.round((completed / totalSteps) * 100);
    setCompletionPercentage(percentage);
    return percentage;
  };

  // UPDATED: Save Resume function to ensure template is saved
  const handleSave = async () => {
    try {
      const currentCompletion = calculateCompletion();

      const editingId = localStorage.getItem("editingResumeId");

      let savedResumeId = editingId;

      // Prepare ALL sections data for bulk save
      const sectionsData = {
        contact: getSectionDataForBackend("basics", resume) || [],
        skills: getSectionDataForBackend("skills", resume) || [],
        experience: getSectionDataForBackend("experience", resume, setIsFresher) || [],
        projects: getSectionDataForBackend("projects", resume) || [],
        "personal-statement": getSectionDataForBackend("personal", resume) || [],
        education: getSectionDataForBackend("education", resume) || [],
        declarations: getSectionDataForBackend("declaration", resume) || [],
        achievements: getSectionDataForBackend("achievements", resume) || [],
        certifications: getSectionDataForBackend("certifications", resume) || [],
        awards: getSectionDataForBackend("awards", resume) || [],
        languages: getSectionDataForBackend("languages", resume) || [],
        interests: getSectionDataForBackend("interests", resume) || [],
      };

      // Use your existing bulk save endpoint
      const response = await sectionAPI.bulkSave(savedResumeId, sectionsData);

      // Update resume metadata with completion percentage AND template
      const response2 = await resumeAPI.update(savedResumeId, {
        resume_name: resume.data.basics.name || "My Resume",
        template_id: resume.templateId,
        completion_percentage: currentCompletion,
        last_updated: new Date().toISOString(),
      });

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

  // Download PDF
  const handleDownload = async (resumeDownloadRef, validateResume) => {
    if (!validateResume()) return;
    const element = resumeDownloadRef.current;
    if (!element) return toast.error("Failed to generate PDF");

    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF…");

    try {
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
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Download Word
  const handleDownloadWord = async (validateResume) => {
    if (!validateResume()) return;

    setIsDownloadingWord(true);
    const toastId = toast.loading("Generating Word document...");

    try {
      await handleSave();
      const fileName = `${resume.data.basics.name || "resume"}.doc`;

      await exportToWord(resumeDownloadRef, fileName);

      toast.success("Word document downloaded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to generate Word document: " + error.message, {
        id: toastId,
      });
    } finally {
      setIsDownloadingWord(false);
    }
  };

  return {
    isDownloading,
    isDownloadingWord,
    isGeneratingShareUrl,
    shareableUrl,
    showShareModal,
    setShowShareModal,
    handleDownload,
    handleDownloadWord,
    handleSave,
    saveSection,
    deleteSectionItem,
    updateResumeCompletion,
    validateEmail,
    validatePhone,
    calculateCompletion,
    getSectionDataForBackend,
  };
};

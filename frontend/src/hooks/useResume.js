// hooks/useResume.js
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { sectionAPI, resumeAPI, summaryAPI } from "../utils/api";
import { normalizeResumeData } from "../utils/formatter";
import html2pdf from "html2pdf.js";
import exportToWord from "../utils/wordExport";

export default function useResume(token) {
  const [resume, setResume] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [shareableUrl, setShareableUrl] = useState("");

  const [visibleExtraSections, setVisibleExtraSections] = useState([]);

  const resumeId = localStorage.getItem("editingResumeId");

  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await resumeAPI.getFullResume(resumeId);
        const normalized = normalizeResumeData(response.data);

        setResume(normalized);
        setVisibleExtraSections(normalized.visible_extra_sections || []);
        // setExtraSections(normalized.extra_sections || {});
        setSelectedTemplate(normalized.template_id || null);
      } catch (err) {
        toast.error("Failed to load resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, token]);

  const updateSection = useCallback((section, value) => {
    setResume((prev) => ({ ...prev, [section]: value }));
  }, []);

  const saveCurrentSection = async (section) => {
    if (!resumeId) return;
console.log("Saving section:", section, resume[section]);
    try {
      setLoading(true);
      await sectionAPI.save(resumeId, section, resume[section], token);
      toast.success(`${section} saved`);
    } catch (err) {
      toast.error(`Failed to save ${section}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (section, itemId) => {
    console.log("Deleting item:", section, itemId);
    try {
      await sectionAPI.deleteItem(resumeId, section, itemId, token);
      setResume((prev) => ({
        ...prev,
        [section]: prev[section].filter((i) => i.id !== itemId),
      }));
      toast.success("Item deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const generateSummary = async (payload) => {
    try {
      setLoading(true);
      const summary = await summaryAPI.generate(payload, token);
      setResume((prev) => ({ ...prev, personalStatement: summary }));
      toast.success("Summary generated");
    } catch {
      toast.error("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId) => setPreviewTemplate(templateId);

  const handleApplyTemplate = async () => {
    try {
      await resumeAPI.update(resumeId, { template_id: previewTemplate }, token);

      setSelectedTemplate(previewTemplate);
      toast.success("Template applied");

      return true;
    } catch {
      toast.error("Failed to apply template");
      return false;
    }
  };

  const handleAddExtra = (sectionType) => {
    const map = {
      Achievements: "achievements",
      Certifications: "certifications",
      Awards: "awards",
      Languages: "languages",
      Interests: "interests",
    };

    const key = map[sectionType];
    if (!key) return;

    // show section
    setVisibleExtraSections((prev) =>
      prev.includes(sectionType) ? prev : [...prev, sectionType]
    );

    // initialize resume array
    setResume((prev) => ({
      ...prev,
      [key]: prev[key]?.length ? prev[key] : [{ id: Date.now() }],
    }));
  };

  const handleDownload = async (ref) => {
    if (!ref?.current) return toast.error("Failed to generate PDF");
    console.log("Starting PDF download...", ref);
    setIsDownloading(true);
    const toastId = toast.loading("Generating PDF…");

    try {
      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 400));

      await html2pdf()
        .set({
          margin: 0,
          filename: `${resume.basics.full_name || "resume"}.pdf`,
          image: { type: "png", quality: 1.0 },
          html2canvas: { scale: 3, useCORS: true, backgroundColor: "#fff" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(ref.current)
        .save();

      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadWord = async (ref) => {
    if (!ref?.current) return toast.error("Failed to generate Word");

    setIsDownloading(true);
    const toastId = toast.loading("Generating Word document...");

    try {
      const fileName = `${resume.basics.full_name || "resume"}.doc`;
      await exportToWord(ref.current, fileName);
      toast.success("Word document downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Word download error:", error);
      toast.error("Failed to generate Word document: " + error.message, {
        id: toastId,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const generateShareLink = async () => {
    try {
      const url = await resumeAPI.generateShareLink(resumeId, token);
      setShareableUrl(url);
    } catch {
      toast.error("Failed to generate share link");
    }
  };

  const bulkSave = async () => {
    if (!resumeId) return;
    console.log("Initiating bulk save for resume:", resumeId, resume);

    try {
      setLoading(true);
      const resp = await sectionAPI.bulkSave(resumeId, resume, token);
      console.log("Bulk save response:", resp);
      toast.success("Resume saved successfully");
    } catch (err) {
      toast.error("Failed to save resume");
    } finally {
      setLoading(false);
    }
  };

  return {
    resume,
    loading,
    isDownloading,

    selectedTemplate,
    previewTemplate,
    shareableUrl,

    visibleExtraSections,
    // extraSections,
    bulkSave,
    updateSection,
    saveCurrentSection,
    deleteItem,
    generateSummary,

    handleTemplateSelect,
    handleApplyTemplate,
    handleAddExtra,
    handleDownload,
    generateShareLink,
    handleDownloadWord,
  };
}

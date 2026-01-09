// hooks/useResume.js
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { sectionAPI, resumeAPI, summaryAPI } from "../utils/api";
import { normalizeResumeData } from "../utils/formatter";

export default function useResume(token) {
  const [resume, setResume] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [shareableUrl, setShareableUrl] = useState("");

  const [visibleExtraSections, setVisibleExtraSections] = useState([]);
  const [extraSections, setExtraSections] = useState({});

  const resumeId = localStorage.getItem("editingResumeId");

  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await resumeAPI.getFullResume(resumeId);
        const normalized = normalizeResumeData(response.data);
        setResume(normalized);
        setVisibleExtraSections(data.visible_extra_sections || []);
        setExtraSections(data.extra_sections || {});
        setSelectedTemplate(data.template_id || null);
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
    } catch {
      toast.error("Failed to apply template");
    }
  };

  const handleAddExtra = (sectionKey) => {
    if (visibleExtraSections.includes(sectionKey)) return;

    setVisibleExtraSections((prev) => [...prev, sectionKey]);
    setExtraSections((prev) => ({ ...prev, [sectionKey]: [] }));
  };

  const handleDownload = async (type = "pdf") => {
    try {
      setIsDownloading(true);
      await resumeAPI.download(resumeId, type, token);
    } catch {
      toast.error("Download failed");
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

    try {
      setLoading(true);
      await sectionAPI.bulkSave(resumeId, resume);
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
    extraSections,
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
  };
}

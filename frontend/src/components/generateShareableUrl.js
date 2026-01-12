 export const generateShareableUrl = async (resume, token, setIsGeneratingShareUrl, setShareableUrl, setShowShareModal, toast, calculateCompletion) => {
    setIsGeneratingShareUrl(true);
    try {
      const currentCompletion = calculateCompletion();

      // Prepare resume data WITH template and completion percentage
      const resumeData = {
        resume_name: resume.title || "My Resume",
        template_id: resume.templateId,
        completion_percentage: currentCompletion,
        last_updated: new Date().toISOString(),
      };

      const opts = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const editingId = localStorage.getItem("editingResumeId");

      let resumeId;
      if (editingId) {
        // Update existing resume with current template and completion
        await axios.put(
          `${API}/api/resumes/resumes/${editingId}`,
          resumeData,
          opts
        );
        resumeId = editingId;
      } else {
        // Create new resume with template and completion
        const response = await axios.post(
          `${API}/api/resumes/resumes`,
          resumeData,
          opts
        );
        resumeId = response.data.resume_id;
        localStorage.setItem("editingResumeId", resumeId);
        setResumeId(resumeId);
      }

      const shareUrl = `${window.location.origin}/view/${resumeId}`;
      setShareableUrl(shareUrl);
      setShowShareModal(true);

      toast.success("Shareable URL generated!");
    } catch (error) {
      handleApiError(error, "Failed to generate share URL");
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
      handleApiError(error, "Failed to copy URL");
    }
  };

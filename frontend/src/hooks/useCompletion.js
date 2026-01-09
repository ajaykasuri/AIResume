// hooks/useCompletion.js
import { useMemo } from "react";

/**
 * Determines completion status and percentage for resume steps
 */
export default function useCompletion(resume = {}, steps = []) {
  /** ---------------- Step Validation ---------------- */
  const isStepComplete = (stepId) => {
    switch (stepId) {
      case "basics":
        return Boolean(resume.basics?.name && resume.basics?.email);

      case "skills":
        return Array.isArray(resume.skills) && resume.skills.length > 0;

      case "experience":
        return Array.isArray(resume.experience) && resume.experience.length > 0;

      case "projects":
        return Array.isArray(resume.projects) && resume.projects.length > 0;

      case "personalStatement":
      case "personal":
        return Boolean(resume.personalStatement);

      case "education":
        return Array.isArray(resume.education) && resume.education.length > 0;

      case "declaration":
        return Boolean(resume.declaration?.text);

      default:
        return false;
    }
  };

  /** ---------------- Completion Percentage ---------------- */
  const completionPercentage = useMemo(() => {
    if (!steps.length) return 0;

    const completed = steps.filter((step) => isStepComplete(step.id)).length;
    return Math.round((completed / steps.length) * 100);
  }, [resume, steps]);

  /** ---------------- Current Step Validation ---------------- */
  const canProceedToNext = (currentStepIndex) => {
    const step = steps[currentStepIndex];
    if (!step) return false;
    return isStepComplete(step.id);
  };

  return {
    isStepComplete,
    completionPercentage,
    canProceedToNext,
  };
}
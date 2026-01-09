// Builder.js (Refactored)
import React, { useState, useRef } from "react";
import { Toaster } from "react-hot-toast";

import {
  BasicsForm,
  SkillsForm,
  ExperienceForm,
  ProjectsForm,
  SummaryForm,
  EducationForm,
  DeclarationForm,
} from "../components/Froms";

import ResumePreview from "../components/ResumePreview";
import TemplateModal from "../components/TemplateModal";
import ExtraSectionsModal from "../components/ExtraSectionsModal";
import ShareModal from "../components/ShareModal";
import { ResumeHeader } from "../components/ResumeHeader";
import { StepNavigation } from "../components/StepNavigation";

import useResume from "../hooks/useResume";
import useCompletion from "../hooks/useCompletion";
import { useParams } from "react-router-dom";

// Steps definition
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
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);


  const resumeDownloadRef = useRef();

  const { resume_id } = useParams();
  localStorage.setItem("editingResumeId", resume_id);

  // Custom hooks for state & completion
  const resumeHook = useResume(token);
  const completionHook = useCompletion(resumeHook.resume, steps);
  const renderForm = () => {
    switch (currentStep) {
      case 0:
        return <BasicsForm {...resumeHook} />;
      case 1:
        return <SkillsForm {...resumeHook} />;
      case 2:
        return <ExperienceForm {...resumeHook} />;
      case 3:
        return <ProjectsForm {...resumeHook} />;
      case 4:
        return <SummaryForm {...resumeHook} />;
      case 5:
        return <EducationForm {...resumeHook} />;
      case 6:
        return (
          <DeclarationForm
            {...resumeHook}
            visibleExtraSections={resumeHook.visibleExtraSections}
            extraSections={resumeHook.extraSections}
             setShowExtraModal={setShowExtraModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="builder-container">
      <Toaster position="top-right" reverseOrder={false} />

      <ResumeHeader
        resumeHook={resumeHook}
        resumeDownloadRef={resumeDownloadRef}
        setShowTemplateModal={setShowTemplateModal}
        setShowShareModal={setShowShareModal}
      />

      <div className="builder-content">
        <div className="builder-left" id="no-print">
          <div className="progress-indicator">
            <div className="progress-header">
              <h3>Resume Completion</h3>
              <span className="progress-percentage">
                {completionHook.completionPercentage}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionHook.completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="step-container">
            {renderForm()}
            <StepNavigation
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              totalSteps={steps.length}
              saveCurrentSection={resumeHook.saveCurrentSection}
            />
          </div>
        </div>

        <div className="builder-right">
          <div id="print-container" ref={resumeDownloadRef}>
            <ResumePreview resume={resumeHook.resume} />
          </div>
        </div>
      </div>

      <TemplateModal
        show={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        selectedTemplate={resumeHook.selectedTemplate}
        previewTemplate={resumeHook.previewTemplate}
        onTemplateSelect={resumeHook.handleTemplateSelect}
        onApplyTemplate={resumeHook.handleApplyTemplate}
      />

      <ExtraSectionsModal
        show={showExtraModal}
        onClose={() => setShowExtraModal(false)}
        onAddExtra={resumeHook.handleAddExtra}
      />

      <ShareModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareableUrl={resumeHook.shareableUrl}
        onDownloadPdf={resumeHook.handleDownload}
        isDownloading={resumeHook.isDownloading}
      />
    </div>
  );
}

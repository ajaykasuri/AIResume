import React from "react";

export const StepNavigation = ({
  currentStep,
  setCurrentStep,
  totalSteps,
  saveCurrentSection,
}) => {
  return (
    <div className="step-navigation">
      <button
        disabled={currentStep === 0}
        onClick={() => setCurrentStep((s) => s - 1)}
      >
        Back
      </button>

      <button onClick={() => saveCurrentSection()}>
        Save
      </button>

      <button
        disabled={currentStep === totalSteps - 1}
        onClick={() => setCurrentStep((s) => s + 1)}
      >
        Next
      </button>
    </div>
  );
};

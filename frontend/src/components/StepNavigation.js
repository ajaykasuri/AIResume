import React from "react";
import "../styles/step-navigation.css"
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

      <button onClick={() => saveCurrentSection(currentStep)}>Save</button>

      <button
        disabled={currentStep === totalSteps - 1}
        onClick={() => setCurrentStep((s) => s + 1)}
      >
        Next
      </button>
    </div>
  );
};

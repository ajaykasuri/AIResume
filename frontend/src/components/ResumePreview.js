import React from "react";
import "../styles/builder.css";
import ClassicTemplate from "../templates/ClassicTemplate";
import ElegantTemplate from "../templates/ElegantTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";
import ModernTemplate from "../templates/ModernTemplate";

export default function ResumePreview({ resume }) {
  if (!resume) return <div>No resume data.</div>;

  const normalizedResume = resume.data ? resume : { data: resume };

  const { templateId = 1, data } = normalizedResume;

  const sectionsOrder = normalizedResume.sectionsOrder || [
    "basics",
    "personal",
    "skills",
    "experience",
    "projects",
    "education",
    "declaration",
    "certifications",
    "achievements",
    "awards",
    "languages",
    "interests",
  ];

  const templates = {
    1: <ClassicTemplate data={data} sectionsOrder={sectionsOrder} />,
    2: <ModernTemplate data={data} sectionsOrder={sectionsOrder} />,
    3: <ExecutiveTemplate data={data} sectionsOrder={sectionsOrder} />,
    4: <ElegantTemplate data={data} sectionsOrder={sectionsOrder} />,
  };

  return templates[templateId] || templates[1];
}

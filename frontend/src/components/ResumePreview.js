import React from "react";
import "../styles/builder.css";
import ClassicTemplate from "../templates/ClassicTemplate";
import ElegantTemplate from "../templates/ElegantTemplate";
import ExecutiveTemplate from "../templates/ExecutiveTemplate";
import ModernTemplate from "../templates/ModernTemplate";

export default function ResumePreview({ resume }) {
  if (!resume || !resume.data) return <div>No resume data.</div>;

  const { templateId, data } = resume;
  const sectionsOrder = resume.sectionsOrder || ['basics','personal','skills','experience','projects','education','declaration'];
// console.log("previwTempId",resume)
  const templates = {
    1: <ClassicTemplate data={data} sectionsOrder={sectionsOrder} />,
    2: <ModernTemplate data={data} />,
    3: <ExecutiveTemplate data={data} />,
    4: <ElegantTemplate data={data} />,
  };


  return templates[templateId] || <ClassicTemplate data={data} sectionsOrder={sectionsOrder} />;
}
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SectionForm from "../components/SectionForm";
import ResumePreview from "../components/ResumePreview";
import { sectionConfig } from "../config/sections";
import { resumeAPI } from "../utils/api";
import { adaptResumeData } from "../utils/resumeAdapter";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const [sectionsOrder, setSectionsOrder] = useState(
    Object.keys(sectionConfig)
  );
  const [resumeData, setResumeData] = useState({
    templateId: 1,
    data: {},
    sectionsOrder: Object.keys(sectionConfig),
  });

  // Fetch full resume initially
  // useEffect(() => {
  //   fetchResume();
  // }, []);

  // const fetchResume = async () => {
  //   try {
  //     const { data } = await resumeAPI.getFullResume(resumeId);
  //     setResumeData(data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    const newOrder = Array.from(sectionsOrder);
    const [removed] = newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, removed);
    setSectionsOrder(newOrder);
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Forms Side */}
      <div style={{ flex: 1 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sectionsOrder.map((sectionKey, index) => (
                  <Draggable
                    key={sectionKey}
                    draggableId={sectionKey}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          marginBottom: "10px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          background: "#f9f9f9",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <SectionForm
                          resumeId={resumeId}
                          sectionKey={sectionKey}
                          resumeData={resumeData}
                          setResumeData={setResumeData}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Resume Preview Side */}
      <div style={{ flex: 1 }}>
<ResumePreview
  resume={{
    templateId: resumeData.templateId,
    sectionsOrder,              
    data: adaptResumeData(resumeData),
  }}
/>
      </div>
    </div>
  );
};

export default ResumeBuilder;

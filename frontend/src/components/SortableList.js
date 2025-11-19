// SortableList.js
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical } from "react-icons/fa";
import "../styles/SortableSection.css"

export const SortableSection = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item" {...attributes}>
         <div className="sortable-content">{children}</div>
      <div className="drag-handle" {...listeners}>
        <FaGripVertical />
      </div>
     
    </div>
  );
};

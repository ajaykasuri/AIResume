import React, { useState, useEffect } from "react";
import { sectionAPI } from "../utils/api";
import { sectionConfig } from "../config/sections";

const SectionForm = ({ sectionKey, resumeId, resumeData, setResumeData }) => {
  const { title, fields } = sectionConfig[sectionKey];
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState(true); // Collapsible

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await sectionAPI.getByResume(sectionKey, resumeId);
      if (data.length > 0) {
        setItems(data);
        setResumeData((prev) => ({ ...prev, [sectionKey]: data }));
      } else {
        // Show one empty form by default
        setItems([{}]);
        setResumeData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            [sectionKey]: data.length ? data : [{}],
          },
        }));
      }
    } catch (err) {
      console.error(err);
      // On error, still show one empty form
      setItems([{}]);
      setResumeData((prev) => ({ ...prev, [sectionKey]: [{}] }));
    }
  };

  const handleChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index][e.target.name] = e.target.value;
    setItems(updatedItems);
    setResumeData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [sectionKey]: updatedItems,
      },
    }));
  };

  const handleAddNew = () => {
    setItems([...items, {}]);
  };

  const handleSave = async (index) => {
    try {
      const item = items[index];
      if (!item.id) {
        // New item
        const response = await sectionAPI.create(sectionKey, {
          resume_id: resumeId,
          ...item,
        });
        const updatedItems = [...items];
        updatedItems[index] = response.data; // Replace with saved data (includes ID)
        setItems(updatedItems);
        setResumeData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            [sectionKey]: updatedItems,
          },
        }));
      } else {
        // Existing item update
        await sectionAPI.update(sectionKey, item.id, item);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (index) => {
    try {
      const item = items[index];
      if (item.id) {
        await sectionAPI.delete(sectionKey, item.id);
      }
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
      setResumeData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          [sectionKey]: updatedItems,
        },
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="section-form" style={{ marginBottom: "20px" }}>
      {/* Collapsible header */}
      <h2
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={() => setExpanded(!expanded)}
      >
        {title} {expanded ? "▲" : "▼"}
      </h2>

      {expanded && (
        <>
          {items.map((item, index) => (
            <div
              key={item.id || index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              {fields.map((f) => (
                <div key={f.name} className="field">
                  <label>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      value={item[f.name] || ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                  ) : (
                    <input
                      type={f.type}
                      name={f.name}
                      value={item[f.name] || ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                  )}
                </div>
              ))}

              <button
                onClick={() => handleSave(index)}
                style={{ marginRight: "10px" }}
              >
                Save
              </button>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          ))}

          <button onClick={handleAddNew}>+ Add Another</button>
        </>
      )}
    </div>
  );
};

export default SectionForm;

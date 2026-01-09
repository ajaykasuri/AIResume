import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AiGeneration() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    role: "",
    skills: "",
  });
const[resumeId,setResumeId]=useState(null);

  const navigate = useNavigate();
  const generate = async () => {
const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:4000/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
     setData(data);
    setResumeId(data.resume_id);
   
  };
useEffect(() => {
  if (data) {
    // Transform AI data to Builder format
    const transformedData = {
      basics: {
        name: data.name || "",
        jobTitle: data.role || "",
        email: data.contact?.includes('@') ? data.contact : "",
        phone: data.contact?.match(/\d/) ? data.contact : "",
        city: "",
        country: "",
        linkedIn: "",
        github: "",
        website: ""
      },
      personalStatement: data.summary || data.professional_summary || "",
      skills: Array.isArray(data.skills_list) ? data.skills_list : [],
      projects: Array.isArray(data.projects) ? data.projects.map((proj, index) => ({
        id: index,
        title: proj.title || "",
        description: Array.isArray(proj.points) ? proj.points.join('\n') : "",
        from: "",
        to: "",
        current: false,
        link: "",
        clientName: "",
        teamSize: "",
        skillsUsed: []
      })) : [],
      declaration: {
        description: data.declaration || "",
        signature: data.name || ""
      },
      experience: [],
      education: [],
      achievements: [],
      certifications: [],
      awards: [],
      languages: [],
      interests: []
    };
    navigate(`/builder/${resumeId}`, { 
      state: { 
        aiGeneratedData: transformedData,
        isFromAI: true 
      }
    });
  }
}, [data, navigate]);
  
  const download = async (type) => {
    const res = await fetch(`http://localhost:4000/api/ai/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `resume.${type === "pdf" ? "pdf" : "docx"}`;
    a.click();
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h2>AI Resume Generator</h2>

      <input
        placeholder="Name"
        value={form.name}
        required
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />

      <input
        placeholder="Contact"
        required
        value={form.contact}
        onChange={(e) => setForm({ ...form, contact: e.target.value })}
      />
      <br />

      <input
        placeholder="Role"
        required
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      />
      <br />
      

      <input
        placeholder="Skills (comma separated)"
        value={form.skills}
        required
        onChange={(e) => setForm({ ...form, skills: e.target.value })}
      />
      <br />

      <button onClick={generate}>Generate Resume</button>

      {/* {data && (
        <>
          <hr />
          <h3>{data.name}</h3>
          <p>
            <strong>Contact:</strong> {data.contact}
          </p>
          <p>
            <strong>Role:</strong> {data.role}
          </p>

          <h4>Summary</h4>
          <p>{data.summary}</p>

          <h4>Skills</h4>
          <p>{data.skills.join(", ")}</p>

          <h4>Projects</h4>

          {Array.isArray(data.projects) &&
            data.projects.map((project, i) => (
              <div key={i}>
                <strong>{project.title || "Untitled Project"}</strong>

                <ul>
                  {Array.isArray(project.points) ? (
                    project.points.map((pt, j) => <li key={j}>{pt}</li>)
                  ) : (
                    <li>No project details available</li>
                  )}
                </ul>
              </div>
            ))}

          <h4>Declaration</h4>
          <p>{data.declaration}</p>

          <button onClick={() => download("pdf")}>Download PDF</button>
          <button onClick={() => download("word")}>Download Word</button>
        </>
      )} */}
    </div>
  );
}

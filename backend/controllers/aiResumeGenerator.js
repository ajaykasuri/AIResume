const { GoogleGenAI } = require("@google/genai");
const PDFDocument = require("pdfkit");
const docx = require("docx");
const { AlignmentType } = require("docx");
const { response } = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const modelName = "gemini-2.5-flash-lite";

exports.generateResume = async (req, res) => {
  try {
    const { name, contact, role, experience, skills } = req.body;

    const user_id = req.user.id;
    // console.log("req.user:", req.user);
    // console.log("data received:", name, contact, role, experience, skills, user_id);

    const normalizedSkills = skills
      .map((s) => s.trim().toLowerCase())
      .sort()
      .join(", ");
    // console.log("normalizedSkills:", normalizedSkills);
    // 1 Check if AI template exists
    const [existingTemplate] = await pool.query(
      "SELECT * FROM ai_resume_templates WHERE role = ? AND skills = ?",
      [role, normalizedSkills]
    );

    let aiData;
    // console.log("existingTemplate:", existingTemplate);
    if (existingTemplate.length > 0) {
      aiData =
        typeof existingTemplate[0].resume_json === "string"
          ? JSON.parse(existingTemplate[0].resume_json)
          : existingTemplate[0].resume_json;
    } else {
      // 2 Generate AI JSON
      const prompt = `
You are an expert ATS-friendly resume writer.

Based on the following candidate details, generate a JSON object containing: and give other skills that are related to
skills mentioned.

1. A professional summary (1 paragraph, concise, professional).
2. A list of 1-2 projects with:
   - "title": project title
   - "points": 6-7 bullet points describing key contributions and technologies used
3. Relevant skills for the skills section (skills used to build the projects)
4. A "declaration" statement (don't include name).

Return ONLY valid JSON in this exact format:

{
  "professional_summary": "string",
  "projects": [
    {
      "title": "string",
      "points": ["string", "string", "..."]
    }
  ],
  "skills": ["string", "string", "..."],
  "declaration": "string"
}

Candidate Details:
- Name: ${name}
- Role: ${role}
- Current Skills: ${skills.join(", ")}
- Experience: ${experience} years
      `;

      const fallbackData = {
        professional_summary: `Motivated ${role} professional with skills in ${skills.join(
          ", "
        )}.`,
        projects: [
          { title: "Sample Project 1", points: ["Implemented core features"] },
          { title: "Sample Project 2", points: ["Delivered on schedule"] },
        ],
        skills,
        declaration: "I hereby declare that the above information is true.",
      };

      try {
        const result = await genAI.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: "application/json" },
        });

        let text = result.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join("")
          .trim();

        if (!text) throw new Error("Empty AI response");

        aiData = JSON.parse(text.replace(/```json|```/g, "").trim());
        // console.log("AI generated data:", aiData);
      } catch (err) {
        console.error("AI failed, using fallback:", err.message);
        aiData = fallbackData;
      }

      // 3 Save AI template for reuse
      await pool.query(
        "INSERT INTO ai_resume_templates (role, skills, resume_json) VALUES (?, ?, ?)",
        [role, normalizedSkills, JSON.stringify(aiData)]
      );
    }

    const resume_id = uuidv4();
    console.log("Generated resume_id:", resume_id);

    // 4 Create a draft resume in rb_Resumes
    const [insertResult] = await pool.query(
      `INSERT INTO rb_Resumes (resume_id,user_id, resume_name, template_name, completion_percentage, status, ai_generated)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [resume_id, user_id, `${role}`, "Classic", 0, "draft", 1]
    );
    // console.log("Insert Result:", insertResult);

    // 5️⃣ Send resume_id + AI JSON to frontend
    res.json({
      resume_id,
      name,
      contact,
      role,
      skills,
      professional_summary: aiData.professional_summary,
      projects: aiData.projects || [],
      skills_list: aiData.skills || [],
      declaration: aiData.declaration,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

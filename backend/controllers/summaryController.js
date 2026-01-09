// backend/controllers/summaryController.js

const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.generateSummary = async (req, res) => {
  const { basics, skills, isFresher } = req.body;

  const prompt = `
You are an expert resume writer specialized in crafting short, ATS-friendly professional summaries.

Candidate Details:


- Target Role: ${basics?.jobTitle || "N/A"}
- Key Skills: ${skills?.length ? skills.join(", ") : "N/A"}
- Fresher: ${isFresher ? "Yes" : "No"}

Instructions:
1. Generate exactly 3–4 sentences.
2. Professional, third-person tone.
3. No years of experience, education, or job titles.
4. Focus on skills and role alignment.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generatedSummary = response.text?.trim() || "No summary generated.";

    res.json({ generatedSummary });
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    res.status(500).json({
      error: "Failed to generate summary",
    });
  }
};

exports.generateProjectSummary = async (req, res) => {
  const {
    projectName,
    projectDescription,
    technologies,
    clientName,
    teamSize,
  } = req.body;

  const prompt = `
You are an expert technical resume writer.

Write ONE clean 3–5 sentence professional project summary.

Project Details:
- Project Name: ${projectName || "N/A"}
- Description: ${projectDescription || "N/A"}
- Technologies: ${
    Array.isArray(technologies) && technologies.length
      ? technologies.join(", ")
      : "N/A"
  }
- Client: ${clientName || "N/A"}
- Team Size: ${teamSize || "N/A"}

Rules:
- No bullet points
- No headings
- No labels
- Third-person tone
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const generatedProjectSummary =
      response.text?.trim() || "No summary generated.";

    res.json({ generatedProjectSummary });
  } catch (error) {
    console.error("Gemini Project Error:", error);
    res.status(500).json({
      error: "Failed to generate project summary",
    });
  }
};

exports.getTemplates = (req, res) => {
  res.json([
    {
      id: 1,
      name: "modern",
      title: "Modern",
      thumb: "/templates/modern.svg",
      desc: "Clean modern layout",
    },
    {
      id: 2,
      name: "classic",
      title: "Classic",
      thumb: "/templates/classic.svg",
      desc: "Traditional classic layout",
    },
    {
      id: 3,
      name: "elegant",
      title: "Elegant",
      thumb: "/templates/elegant.svg",
      desc: "Minimal elegant layout",
    },
  ]);
};

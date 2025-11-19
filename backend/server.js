// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { GoogleGenAI } = require("@google/genai");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Constants
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ========== ROUTES ==========

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Resume routes (protected)
const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/resumes", resumeRoutes);

// ========== AI ENDPOINTS ==========

// Generate professional summary using Gemini API
app.post("/api/generate-summary", async (req, res) => {
  const { basics, skills, isFresher } = req.body;

  const prompt = `
    You are an expert resume writer specialized in crafting short, ATS-friendly professional summaries.

    ---
    **Candidate Details**
    - Target Role: ${basics?.jobTitle || "N/A"}
    - Key Skills: ${skills?.length ? skills.join(", ") : "N/A"}
    - Fresher: ${isFresher ? "Yes" : "No"}

    ---
    **Instructions**
    1. Generate exactly 3–4 sentences in a professional, third-person tone.
    2. Focus entirely on the target role and skills.
    3. If the candidate is a fresher, emphasize enthusiasm, learning mindset, and technical foundation.
    4. Do **not** mention years of experience, job titles, or education.
    5. Make the summary concise, confident, and impactful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    // Adjust for Gemini response structure
    const generatedSummary = response.text?.trim() || "No summary generated.";
    res.json({ generatedSummary });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to generate summary. Please try again later.",
    });
  }
});

app.post("/api/generate-projectSummary", async (req, res) => {
  const { projectName, projectDescription, technologies, clientName, teamSize } = req.body;

  const prompt = `
You are an expert technical resume writer. Generate a polished, concise, and impactful project summary.

---
PROJECT DETAILS
- Project Name: ${projectName || "N/A"}
- Description: ${projectDescription || "N/A"}
- Technologies Used: ${Array.isArray(technologies) && technologies.length ? technologies.join(", ") : "N/A"}
- Client: ${clientName || "N/A"}
- Team Size: ${teamSize || "N/A"}

---
INSTRUCTIONS
1. Write a 3–5 sentence professional project summary.
2. Describe the project’s purpose, key features, and outcomes.
3. Highlight technology usage naturally within the summary.
4. If clientName exists, subtly mention client collaboration or delivery.
5. Use a third-person, results-oriented tone (avoid "I", "we", "our").
6. Optimize for resumes and LinkedIn profiles.
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
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to generate project summary",
    });
  }
});




app.get("/api/templates", (req, res) => {
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
});



app.get("/", (req, res) => res.json({ status: "Server is running ✅" }));



app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));

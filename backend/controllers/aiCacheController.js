const { GoogleGenAI } = require("@google/genai");
const aiService = require("../services/aiCacheService");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = {
  generateSummary: async (req, res) => {
    const { basics, skills, isFresher } = req.body;
    const payload = { basics, skills, isFresher };

    // 1. Check cache
    const { hash, cached } = await aiService.getCachedResult("summary", payload);
    if (cached) {
      return res.json({ generatedSummary: cached, fromCache: true });
    }

    // 2. Build prompt
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
        contents: prompt
      });

      const generatedSummary = response.text?.trim();

      // 3. Save to cache
      await aiService.saveResult("summary", hash, payload, generatedSummary);

      res.json({ generatedSummary, fromCache: false });
    } catch (error) {
      res.status(500).json({ error: "AI generation failed" });
    }
  },


  generateProjectSummary: async (req, res) => {
    const { projectName, projectDescription, technologies, clientName, teamSize } = req.body;

    const payload = {
      projectName,
      projectDescription,
      technologies,
      clientName,
      teamSize,
    };

    // 1. Check cached result
    const { hash, cached } = await aiService.getCachedResult("projectSummary", payload);
    if (cached) {
      return res.json({ generatedProjectSummary: cached, fromCache: true });
    }

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
1. Write a 5–7 sentence professional project summary.
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

      const generatedProjectSummary = response.text?.trim();

      // 3. Save to cache
      await aiService.saveResult(
        "projectSummary",
        hash,
        payload,
        generatedProjectSummary
      );

      res.json({ generatedProjectSummary, fromCache: false });
    } catch (error) {
      res.status(500).json({ error: "AI generation failed" });
    }
  },
};

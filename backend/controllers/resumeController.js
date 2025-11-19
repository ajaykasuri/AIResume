const Resume = require("../models/Resume");

exports.create = async (req, res) => {
  try {
    const { title, template, templateId, data } = req.body;

    const rec = await Resume.createResume(
      req.user.id,
      title,
      template,
      data,
      templateId
    );
    res.status(201).json(rec);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.list = async (req, res) => {
  try {
    const rows = await Resume.getResumesByUser(req.user.id);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.get = async (req, res) => {
  try {
    const rec = await Resume.getResumeById(req.params.id, req.user.id);
    if (!rec) return res.status(404).json({ error: "Not found" });
    res.json(rec);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, template, data } = req.body;
    const rec = await Resume.updateResume(
      req.params.id,
      req.user.id,
      title,
      template,
      data
    );
    res.json(rec);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    await Resume.deleteResume(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.changeTemplate = async (req, res) => {
  try {
    const { newTemplate } = req.body;
    const rec = await Resume.changeTemplate(
      req.params.id,
      req.user.id,
      newTemplate
    );
    res.json(rec);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

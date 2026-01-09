// controllers/sectionController.js
const sectionService = require('../services/sectionService');

// ===== Smart Save Section =====
exports.smartSaveSection = async (req, res) => {
  try {
    const { resumeId } = req.params;
  console.log("Smart Save Params:", req.params);
    const section = req.path.split("/")[2]; 
    const items = req.body; 

    const result = await sectionService.smartSave(resumeId, section, items);
    res.json(result);
  } catch (err) {
    console.error("Smart Save Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===== Delete Single Item =====
exports.deleteSectionItem = async (req, res) => {
  try {
    const { resumeId, id } = req.params;
    // console.log("Delete Item Params:", req.params);
    const section = req.path.split("/")[2]; 

    const result = await sectionService.deleteItem(resumeId, section, id);
    res.json(result);
  } catch (err) {
    console.error("Delete Item Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===== Bulk Save Multiple Sections =====
exports.bulkSaveSections = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const sectionsData = req.body; // { skills: [...], experience: [...], ... }
    const result = await sectionService.bulkSave(resumeId, sectionsData);
    // console.log("Bulk Save Result:", result);
    res.json(result);
  } catch (err) {
    console.error("Bulk Save Error:", err);
    res.status(500).json({ error: err.message });
  }
};

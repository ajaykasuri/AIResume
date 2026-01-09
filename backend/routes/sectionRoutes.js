// routes/sectionRoutes.js
const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const auth = require("../middleware/auth");

// List of all sections
const sections = [
  "/contact",
  "/education",
  "/experience",
  "/skills",
  "/projects",
  "/declarations",
  "/awards",
  "/achievements",
  "/certifications",
  "/languages",
  "/interests",
  "/personal-statement",
  "/courses",
  "/publications",
  "/references",
];

// Generate routes for individual sections
sections.forEach((section) => {
  // Save or update a section (smart save)
  router.post(`/:resumeId${section}`, auth, sectionController.smartSaveSection);

  // Delete a single item from a section
  router.delete(
    `/:resumeId${section}/:id`,
    auth,
    sectionController.deleteSectionItem
  );
});

// Bulk save multiple sections at once
router.post("/:resumeId/bulk", auth, sectionController.bulkSaveSections);

module.exports = router;

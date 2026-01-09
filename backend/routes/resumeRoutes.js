const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const sectionController = require("../controllers/sectionController");
const auth = require("../middleware/auth");
const { uploadThumbnail } = require("../config/multer");

router.use(auth);

// Resume management
router.get("/users/resumes", resumeController.getUserResumes);
router.post("/", resumeController.createResume);
router.get("/:resumeId", resumeController.getFullResume);
router.put("/:resumeId", resumeController.updateResume);
router.delete("/:resumeId", resumeController.deleteResume);

router.post(
  "/upload-thumbnail/:resumeId",
  uploadThumbnail.single("thumbnail"),
  resumeController.uploadThumbnail
);

// Section operations
const sections = [
  "contact",
  "education",
  "experience",
  "skills",
  "projects",
  "declarations",
  "awards",
  "achievements",
  "certifications",
  "languages",
  "interests",
  "personal-statement",
  "courses",
  "publications",
  "references",
];

sections.forEach((section) => {
  router.post(
    `/:resumeId/${section}`,
    sectionController.smartSaveSection
  );

  router.delete(
    `/:resumeId/${section}/:id`,
    sectionController.deleteSectionItem
  );
});

// Bulk save
router.put("/:resumeId", sectionController.bulkSaveSections);

module.exports = router;

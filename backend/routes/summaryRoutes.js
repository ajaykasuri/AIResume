const express = require("express");
const router = express.Router();

const aiController = require("../controllers/summaryController");

router.post("/generate-summary", aiController.generateSummary);
router.post("/generate-projectSummary", aiController.generateProjectSummary);
router.get("/templates", aiController.getTemplates);

module.exports = router;

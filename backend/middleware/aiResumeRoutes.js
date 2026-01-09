const express = require("express");
const router = express.Router();
const controller = require("../controllers/aiResumeGenerator");

router.post("/generate", controller.generateResume);
router.post("/pdf", controller.generatePDF);
router.post("/word", controller.generateWord);

module.exports = router;

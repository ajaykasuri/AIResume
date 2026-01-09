const express = require("express");
const router = express.Router();
const controller = require("../controllers/aiResumeGenerator");
const auth=require("../middleware/auth");
router.use(auth);
router.post("/generate", controller.generateResume);
// router.post("/pdf", controller.generatePDF);
// router.post("/word", controller.generateWord);

module.exports = router;

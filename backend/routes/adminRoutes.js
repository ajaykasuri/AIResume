const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const adminController = require("../controllers/adminController");

router.use(authMiddleware);
router.use(adminAuth);

router.get("/dashboard", adminController.getDashboard);

router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.delete("/users/:id", adminController.deleteUser);
router.put("/users/:id/role", adminController.updateUserRole);

router.get("/resumes", adminController.getResumes);

router.get("/analytics/templates", adminController.getTemplateAnalytics);

module.exports = router;

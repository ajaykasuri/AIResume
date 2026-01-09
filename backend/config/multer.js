const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure directory exists
const THUMBNAIL_DIR = "uploads/thumbnails";
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, THUMBNAIL_DIR),
  filename: (req, file, cb) => {
    const resumeId = req.params.resumeId;
    console.log("Uploading thumbnail for resume ID:", resumeId);
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `resume-${resumeId}${ext}`);
  }
});

// Only allow images
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files allowed"), false);
  }
  cb(null, true);
};

const uploadThumbnail = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 2MB
});

module.exports = { uploadThumbnail };

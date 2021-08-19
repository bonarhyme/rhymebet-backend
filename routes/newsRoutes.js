const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.diskStorage({});

const { createNews } = require("../controllers/newsController");
const admin = require("../middleware/adminAuthMiddleware");
const protect = require("../middleware/authMiddleware");

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, file.fieldname + "-" + Date.now());
  } else {
    cb("invalid image file!", false);
  }
};

const upload = multer({ storage, fileFilter });

//  /api/news/create
router.post("/create", protect, admin, upload.array("image"), createNews);

module.exports = router;

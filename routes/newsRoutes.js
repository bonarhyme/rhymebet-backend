const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.diskStorage({});

const {
  createNews,
  getNews,
  getSingleNews,
} = require("../controllers/newsController");
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

//  /api/news/all
router.get("/all", getNews);

//  /api/news/:id/
router.get("/:id", getSingleNews);

module.exports = router;

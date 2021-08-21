const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.diskStorage({});

const {
  createNews,
  getNews,
  getSingleNews,
  createComment,
  replyComment,
} = require("../controllers/newsController");
const admin = require("../middleware/adminAuthMiddleware");
const protect = require("../middleware/authMiddleware");
const comment = require("../middleware/commentMiddleware");

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

//  /api/news/comment/:id/
router.post("/comment/:id", comment, createComment);

//  /api/news/comment/:id/:commentId
router.post("/comment/:id/:commentId", comment, replyComment);

module.exports = router;

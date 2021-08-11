const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminAuthMiddleware");

const { getAllUser } = require("../controllers/adminController");

// /api/admin/users/all
router.get("/users/all", protect, admin, getAllUser);

module.exports = router;

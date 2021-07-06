const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminAuthMiddleware");

const { createGames } = require("../controllers/gameController");

// api/games/create
router.post("/create", protect, admin, createGames);

module.exports = router;

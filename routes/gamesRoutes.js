const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminAuthMiddleware");

const { createGames, getGames } = require("../controllers/gameController");

// api/games/create
router.post("/create", protect, admin, createGames);

// api/games/list
router.get("/list", protect, admin, getGames);

module.exports = router;

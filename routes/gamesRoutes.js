const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminAuthMiddleware");

const {
  createGames,
  getGames,
  updateParticularGame,
} = require("../controllers/gameController");

// api/games/create
router.post("/create", protect, admin, createGames);

// api/games/list
router.get("/list", protect, admin, getGames);

// api/games/list/game/update/:id
router.put("/list/game/update/:id", protect, admin, updateParticularGame);

module.exports = router;

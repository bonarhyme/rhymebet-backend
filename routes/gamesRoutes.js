const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminAuthMiddleware");

const {
  createGames,
  getGames,
  getPremiumGames,
  updateParticularGame,
  deleteParticularGame,
} = require("../controllers/gameController");

// api/games/create
router.post("/create", protect, admin, createGames);

// api/games/list
router.get("/list", getGames);

// api/games/list/premium
router.get("/list/premium", protect, getPremiumGames);

// /api/games/list/game/update/:id/?status=won || failed
router.put("/list/game/update/:id", protect, admin, updateParticularGame);

// /api/games/list/game/delete/:id
router.delete("/list/game/delete/:id", protect, admin, deleteParticularGame);

module.exports = router;

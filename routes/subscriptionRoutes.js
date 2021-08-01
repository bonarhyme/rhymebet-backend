const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminAuthMiddleware");

const { sendPaystackConfig } = require("../controllers/subscriptionController");

// /api/subscriptions/paystack/config
router.get("/paystack/config", sendPaystackConfig);

module.exports = router;

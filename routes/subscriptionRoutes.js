const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminAuthMiddleware");

const {
  sendPaystackConfig,
  confirmPayment,
} = require("../controllers/subscriptionController");

// /api/subscriptions/paystack/config
router.get("/paystack/config", sendPaystackConfig);

// //api/subscriptions/confirm
router.post("/confirm", protect, confirmPayment);

module.exports = router;

const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminAuthMiddleware");

const {
  sendPaystackConfig,
  confirmPayment,
  getActiveSubsUser,
} = require("../controllers/subscriptionController");

// /api/subscriptions/paystack/config
router.get("/paystack/config", sendPaystackConfig);

// //api/subscriptions/confirm
router.post("/confirm", protect, confirmPayment);

// /api/subscriptions/active-subscriptions
router.get("/active-subscriptions", protect, admin, getActiveSubsUser);

module.exports = router;

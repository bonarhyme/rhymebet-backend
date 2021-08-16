const express = require("express");
const router = express.Router();

const { getUserReferrals } = require("../controllers/referralController");
const protect = require("../middleware/authMiddleware");

//  /api/referral/user/all/:id/?pageNumber=theNumber
router.get("/user/all/:id", protect, getUserReferrals);

module.exports = router;

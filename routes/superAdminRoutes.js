const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const superAdmin = require("../middleware/superAdminMiddleware");

const { getRegularUsers } = require("../controllers/superAdminController");

// /api/super-admin/users/regular/
router.get("/users/regular", protect, superAdmin, getRegularUsers);

module.exports = router;

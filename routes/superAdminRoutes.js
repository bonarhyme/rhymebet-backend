const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const superAdmin = require("../middleware/superAdminMiddleware");

const {
  getRegularUsers,
  makeAdmin,
} = require("../controllers/superAdminController");

// /api/super-admin/users/regular/
router.get("/users/regular", protect, superAdmin, getRegularUsers);

// /api/super-admin/users/regular/:id
router.put("/users/regular/:id", protect, superAdmin, makeAdmin);

module.exports = router;

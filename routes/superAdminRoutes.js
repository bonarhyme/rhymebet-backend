const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const superAdmin = require("../middleware/superAdminMiddleware");

const {
  getRegularUsers,
  makeAdmin,
  getAdminUsers,
  demoteAdmin,
  getSuperAdminUsers,
  makeSuperAdmin,
} = require("../controllers/superAdminController");

// /api/super-admin/users/regular/
router.get("/users/regular", protect, superAdmin, getRegularUsers);

// /api/super-admin/users/regular/:id
router.put("/users/regular/:id", protect, superAdmin, makeAdmin);

// /api/super-admin/users/admin/:id
router.put("/users/admin/:id", protect, superAdmin, makeSuperAdmin);

// /api/super-admin/users/admin/:id
router.get("/users/admin", protect, superAdmin, getAdminUsers);

// /api/super-admin/users/admin/:id/remove
router.put("/users/admin/:id/remove", protect, superAdmin, demoteAdmin);

// /api/super-admin/users/super-admin/?pageNumber=theNumber
router.get("/users/super-admin", protect, superAdmin, getSuperAdminUsers);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  resetPassword,
  checkToken,
} = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");
const {
  checkForm,
  checkUsername,
  checkPassword,
  checkEmail,
} = require("../middleware/checkForms");

router.get("/check-token", protect, checkToken);

//  /api/user/register/?ref=username
router.post("/register", checkForm, registerUser);

// /api/user/verify-user
router.put("/verify-user", checkUsername, verifyUser);

// /api/user/login
router.post("/login", checkUsername, loginUser);

// api/user/forgot-password
router.post("/forgot-password", checkEmail, forgotPassword);

// api/users/reset-password
router.post("/reset-password", checkPassword, resetPassword);

module.exports = router;

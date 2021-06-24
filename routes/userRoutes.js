const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userControllers");
const {
  checkForm,
  checkUsername,
  checkPassword,
  checkEmail,
} = require("../middleware/checkForms");

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

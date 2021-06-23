const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyUser,
  loginUser,
} = require("../controllers/userControllers");
const { checkForm, checkUsername } = require("../middleware/checkForms");

//  /api/user/register/?ref=username
router.post("/register", checkForm, registerUser);

// /api/user/verify-user
router.put("/verify-user", checkUsername, verifyUser);

// /api/user/login
router.post("/login", checkUsername, loginUser);

module.exports = router;

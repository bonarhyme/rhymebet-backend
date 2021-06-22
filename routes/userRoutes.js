const express = require("express");
const router = express.Router();

const {
  registerUser,
  // loginUser
} = require("../controllers/userControllers");
const { checkForm, checkUsername } = require("../middleware/checkForms");

//  /api/user/register/?ref=username
router.post("/register", checkForm, registerUser);

// router.post("/login", checkUsername, loginUser);

module.exports = router;

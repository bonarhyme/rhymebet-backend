const Joi = require("joi");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Referral = require("../models/ReferralModel");
const confirmEmail = require("../utility/confirmEmail");
const forgotPasswordEmail = require("../utility/forgotPassword");
const generateToken = require("../utility/generateToken");

const schema = Joi.object({
  name: Joi.string().min(3).max(55).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(7).max(55).required(),
});

const usernameSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
});

const passwordSchema = Joi.object({
  password: Joi.string().min(7).max(55).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

/**
 * @description This registers a user
 * @description The routes are POST request of /api/user/register/?ref=username
 * @access This a public routes
 */

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    res.status(400);
    throw new Error(
      "You cannot send an incomplete field. Please check your field and try again."
    );
  } else {
    const emailExist = await User.findOne({ email });
    const usernameExist = await User.findOne({ username });

    if (emailExist) {
      res.status(400);
      throw new Error("Email address is taken. Please try a unique one.");
    } else {
      if (usernameExist) {
        res.status(400);
        throw new Error("Username is taken. Please try a unique one.");
      } else {
        const token = Math.floor(1000 + Math.random() * 9000);

        const newUser = await User.create({
          name,
          username,
          email,
          password,
          token,
        });

        if (newUser) {
          if (req.query.ref) {
            const e = req.query.ref;
            const referralUser = await User.findOne({ username: e });
            if (referralUser) {
              referralUser.referral = referralUser.referral + 1;
              await referralUser.save();

              const newReferral = await new Referral({
                theReferreeUserId: referralUser._id,
                referredUsername: newUser.username,
                theReferree: referralUser.username,
              });
              await newReferral.save();
            }
          }
          confirmEmail(newUser);
          res.send({
            message: "New user successfully created.",
          });
        } else {
          res.status(500);
          throw new Error(
            "An error has occured at our end and Registration failed. Please try again."
          );
        }
      }
    }
  }
});

/**
 * @description This verifies a user
 * @description The routes are PUT request of /api/user/verify-user
 * @required reqbody.username and req.body.token
 * @access This a public routes
 */

const verifyUser = asyncHandler(async (req, res) => {
  const { username, token } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    res.status(400);
    throw new Error(
      "The username you provided does not exist in our system. It might have been mispelt or has been deactivated."
    );
  }

  if (user.isVerified == true) {
    res.status(400);
    throw new Error(
      "Dear Customer, your account has already been verified and you cannot verify it again."
    );
  }
  if (user && user.token === token) {
    user.isVerified = true;
    const verified = await user.save();

    if (verified) {
      const referredUser = await Referral.findOne({
        referredUsername: user.username,
      });
      if (referredUser) {
        referredUser.isVerified = true;
        await referredUser.save();
      }
      res.send({
        message:
          "Your account has been verified successfully. You can now login.",
      });
    }
  } else {
    res.status(400);
    throw new Error(
      "Your account was not verified because the username or token you provided is incorrect."
    );
  }
  res.end();
});

/**
 * @description This sends the user a verification email again
 * @description The routes are POST request of /api/user/send-verification/again
 * @required reqbody.username
 * @access This a public routes
 */
const sendVerificationAgain = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const emailExist = await User.findOne({
    email,
  });

  const emailVerified = await User.findOne({
    email,
    isVerified: true,
  });

  if (emailVerified) {
    res.status(400);
    throw new Error("User already verified.");
  }

  if (!emailExist) {
    res.status(404);
    throw new Error("Email does not exist. Please check your spelling.");
  }

  if (emailExist) {
    confirmEmail(emailExist);
    res.send({
      message:
        "An email containing your verification code has been sent to your email again.",
    });
  }
});

/**
 * @description This allows a user to login
 * @description The routes are POST request of /api/user/login
 * @required req.body.username and req.body.password
 * @access This a public routes
 */

const loginUser = asyncHandler(async (req, res) => {
  // console.log(req.ip);
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error(
      "You cannot send an incomplete form. Please make sure you send a valid username and it's corresponding password."
    );
  }

  const usernameExist = await User.findOne({ username });

  if (!usernameExist) {
    res.status(404);
    throw new Error(
      "User does not exist in our system. Please check your spelling."
    );
  }

  if (usernameExist.isVerified === false) {
    res.status(401);
    throw new Error(
      "You have not verified your account. Check your email to verify your account or click on verify account."
    );
  }

  if (await usernameExist.matchPassword(password)) {
    res.json({
      _id: usernameExist._id,
      name: usernameExist.name,
      email: usernameExist.email,
      username: usernameExist.username,
      isAdmin: usernameExist.isAdmin,
      isSuperAdmin: usernameExist.isSuperAdmin,
      // isVerified: usernameExist.isVerified,
      token: generateToken(usernameExist._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

/**
 * @description This sends the user a password reset mail
 * @description The routes are POST request of /api/user/forgot-password
 * @required req.body.email
 * @access This a public routes
 */

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("You cannot send an incomplete form.");
  }

  const emailExist = await User.findOne({ email });

  if (!emailExist) {
    res.status(401);
    throw new Error("This user does not exist in our system.");
  }

  const user = {
    email,
    token: generateToken(emailExist._id),
  };

  // console.log(user);
  await forgotPasswordEmail(user);

  res.send({
    message:
      "Please check your email to reset your password. If you haven't received our email in 15 minutes, please check your spam folder. WSometimes it takes a bit longer, be patient! Double-check your spam and trash folders! If it still doesn't appear please redo the step again.",
  });
});

/**
 * @description This resets the user's password
 * @description The routes are POST request of /api/user/reset-password
 * @required req.body.password && req.body.token
 * @access This a public routes
 */

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  let decoded;

  if (!password || !token) {
    res.status(400);
    throw new Error("You cannot send an incomplete form.");
  }
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(400);
    throw new Error(
      "Dear customer, your password reset failed because there is a problem with your token - It appears to have expired or altered. Please start the process over again by clicking on forgot password and complete it as soon as possible. We apologise for the inconveniences this might have caused you. "
    );
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist in our system.");
  }

  if (await user.matchPassword(password)) {
    res.status(400);
    throw new Error(
      "You cannot set a new password if it matches a current one. Please, choose another password."
    );
  }

  user.password = password;
  await user.save();
  res.send({ message: "Your password has been reset successfully." });
});

/**
 * @description This checks the user token
 * @description The routes are GET request of /api/user/check-token
 * @access This a private user routes
 */

const checkToken = asyncHandler(async (req, res) => {
  if (req.user) {
    res.send({ message: "User's token is valid." });
  } else {
    res.status(404);
    throw new Error("User is invalid.");
  }
});

/**
 * @description This gets users profile using the user's authentication
 * @description The routes are GET request of /api/user/profile
 * @access This a private and protected route for only registered users
 */

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select([
    "-password",
    "-token",
    "-createdAt",
    "-updatedAt",
    "-isVerified",
  ]);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @description This updates users profile using the user's authentication
 * @description The routes are PUT request of /api/user/profile-update
 * @access This a private and protected route for only registered users
 */

const updateUserProfile = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    (user.name = name || user.name), (user.email = email || user.email);

    const updatedUser = await user.save();

    if (updatedUser) {
      res.send({
        message: "Your profile has been updated successfully.",

        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        isAdmin: updatedUser.isAdmin,
        isSuperAdmin: updatedUser.isSuperAdmin,
        token: generateToken(updatedUser._id),
      });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @description This updates the user's password
 * @description The routes are PUT request of /api/user/update-password
 * @required req.body.password && req.body.currentPassword
 * @access This a private and protected route for only registered users
 */

const updatePassword = asyncHandler(async (req, res) => {
  const { password, currentPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!password || !currentPassword) {
    res.status(400);
    throw new Error("You cannot send an empty form.");
  }

  if ((await user.matchPassword(currentPassword)) === false) {
    res.status(400);
    throw new Error(
      "The password you set as your current password does not your match your account's password."
    );
  }

  if (await user.matchPassword(password)) {
    res.status(400);
    throw new Error(
      "You cannot set your current password as your new password."
    );
  }

  user.password = password || user.password;
  const updatedPassword = await user.save();

  if (updatedPassword) {
    res.send({ message: "Your password has been changed successfully." });
  }
});

module.exports = {
  schema,
  usernameSchema,
  passwordSchema,
  emailSchema,
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
  resetPassword,
  checkToken,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  sendVerificationAgain,
};

const Joi = require("joi");
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
        referredUsername: user.usernamel,
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
 * @description This allows a user to login
 * @description The routes are POST request of /api/user/login
 * @required req.body.username and req.body.password
 * @access This a public routes
 */

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error(
      "You cannot send an incomplete form. Please make sure you send a valid username and it's corresponding password."
    );
  }

  const usernameExist = await User.findOne({ username });

  if (!usernameExist) {
    res.status(400);
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
      isVerified: usernameExist.isVerified,
      token: generateToken(usernameExist._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

// User sends the user a password reset mail
// api/users/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("You cannot send an empty form.");
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

  console.log(user);
  await forgotPasswordEmail(user);

  res.send({
    message:
      "<div> <h3> Please check your email to reset your password.</h3><hr /><p> If you haven't received our email in 15 minutes, please check your spam folder.</p><p>Sometimes it takes a bit longer, be patient! Double-check your spam and trash folders!</p><p>If it still doesn't appear please redo the step again</p> </div>",
  });
});

module.exports = {
  schema,
  usernameSchema,
  emailSchema,
  registerUser,
  verifyUser,
  loginUser,
  forgotPassword,
};

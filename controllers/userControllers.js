const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Referral = require("../models/ReferralModel");
const confirmEmail = require("../utility/confirmEmail");

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

// const loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     res.send({
//       error:
//         "C'mon! You cannot send an incomplete field during registration. Please provide a name, email, username and password. ",
//     });
//   } else {
//     res.send(req.body);
//   }
// };

module.exports = {
  schema,
  usernameSchema,
  emailSchema,
  registerUser,
  // loginUser,
};

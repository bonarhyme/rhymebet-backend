const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * @description This middleware checks the user token supplied as Bearer  and if none is supplied passed the guest as the req.user
 * @required Bearer Authorization
 */

const commentMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error({
        message: "Token failed from comment middleware.",
      });
      res.status(401);
      throw new Error("You have to login again.");
    }
  }
  if (!token) {
    req.user = { username: "guest" };
    next();
  }
});

module.exports = commentMiddleware;

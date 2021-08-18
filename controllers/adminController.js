const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * @description This gets all the users
 * @description The routes are GET request of /api/admin/users/all/?pageNumber=theNumber
 * @description It depends on pageNumber passed as the query
 * @access This is an admin or super admin only page
 */

const getAllUser = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber);

  const count = await User.countDocuments({ isSuperAdmin: false });
  const allUsers = await User.find({ isSuperAdmin: false })
    .select(["-password", "-token", "-isSuperAdmin"])
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({
      createdAt: -1,
    });

  if (allUsers) {
    res.send({ allUsers, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(404);
    throw new Error("No user was found.");
  }
});

module.exports = {
  getAllUser,
};

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * @description This gets all regular users
 * @description The routes are GET request of /api/super-admin/users/regular/?pageNumber=theNumber
 * @description It depends on pageNumber passed as the query
 * @access This is an super admin only page
 */

const getRegularUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber);

  const count = await User.countDocuments({
    isSuperAdmin: false,
    isAdmin: false,
  });
  const allUsers = await User.find({ isSuperAdmin: false, isAdmin: false })
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

/**
 * @description This gets all admin users
 * @description The routes are GET request of /api/super-admin/users/admin/?pageNumber=theNumber
 * @description It depends on pageNumber passed as the query
 * @access This is an super admin only page
 */

const getAdminUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber);

  const count = await User.countDocuments({
    isSuperAdmin: false,
    isAdmin: true,
  });
  const allUsers = await User.find({ isSuperAdmin: false, isAdmin: true })
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

/**
 * @description This makes a user an admin
 * @description The routes are PUT request of /api/super-admin/users/regular/:id
 * @access This is an super admin only page
 */

const makeAdmin = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (user) {
    user.isAdmin = true;
    const updated = await user.save();

    if (updated) {
      res.send({ message: `${user.name} has been made an admin` });
    } else {
      res.status(404);
      throw new Error(`Failed to make user: ${user.name} an admin`);
    }
  } else {
    res.status(404);
    throw new Error("User does not exist in our system.");
  }
});

/**
 * @description This removes a user as an admin
 * @description The routes are PUT request of /api/super-admin/users/admin/:id/remove
 * @access This is an super admin only page
 */

const demoteAdmin = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (user) {
    user.isAdmin = false;
    const updated = await user.save();

    if (updated) {
      res.send({ message: `${user.name} has been removed as  an admin` });
    } else {
      res.status(404);
      throw new Error(`Failed to remove user: ${user.name} an admin`);
    }
  } else {
    res.status(404);
    throw new Error("User does not exist in our system.");
  }
});

module.exports = {
  getRegularUsers,
  makeAdmin,
  getAdminUsers,
  demoteAdmin,
};

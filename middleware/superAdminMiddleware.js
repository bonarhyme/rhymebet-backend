const superAdmin = (req, res, next) => {
  if (req.user && req.user.isSuperAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a super admin");
  }
};
module.exports = superAdmin;

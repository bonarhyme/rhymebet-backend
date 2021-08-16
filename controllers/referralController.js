const asyncHandler = require("express-async-handler");
const Referral = require("../models/ReferralModel");

/**
 * @description This lists all the referrals for a particular user and requires pageNumber to display pagination
 * @example /api/referral/user/all/:id/?pageNumber=theNumber
 * @access This a private routes for users
 */

const getUserReferrals = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const user = req.user;

  let unverified, verified, paid, unpaid;

  const count = await Referral.countDocuments({
    theReferree: user.username,
  });

  const refs = await Referral.find({
    theReferree: user.username,
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({
      createdAt: -1,
    });

  unverified = await Referral.find({
    theReferree: user.username,
    isVerified: false,
  });

  verified = await Referral.find({
    theReferree: user.username,
    isVerified: true,
  });

  paid = await Referral.find({
    theReferree: user.username,
    isReferralPaid: true,
  });

  unpaid = await Referral.find({
    theReferree: user.username,
    isReferralPaid: false,
  });

  const refCount = await Referral.countDocuments({
    theReferree: user.username,
  });

  if (refs && refs.length > 0) {
    res.json({
      refs,
      refCount,
      unverified,
      verified,
      paid,
      unpaid,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } else {
    res.status(400);
    throw new Error("No referrals found.");
  }
});

module.exports = {
  getUserReferrals,
};

const axios = require("axios");
const FormData = require("form-data");
const data = new FormData();
const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");
const User = require("../models/userModel");
const generateExpiryDate = require("../utility/generateExpiryDate");

/**
 * @description This sends paystack config to the frontend
 * @description The routes are GET request of /api/subscription/paystack/config
 * @access This a public routes
 */
const sendPaystackConfig = (req, res) => {
  res.send({
    email: process.env.PAYSTACK_ACC_EMAIL,
    publicKey: process.env.PAYSTACK_ACC_PUBLIC_KEY,
  });
};

/**
 * @description This receives and confirms the user payment
 * @description The routes are POST request of /api/subscription/confirm
 * @access This a private routes for users only || generous admins
 */

const confirmPayment = asyncHandler(async (req, res) => {
  const {
    message,
    reference,
    status,
    trans,
    transaction,
    trxref,
    amount,
    plan,
    duration,
  } = req.body;

  if (
    !message ||
    !reference ||
    !status ||
    !trans ||
    !transaction ||
    !trxref ||
    !amount ||
    !plan ||
    !duration
  ) {
    res.status(400);
    throw new Error("Your request appears to be incomplete.");
  }
  const { username, name, email, _id } = req.user;

  const userExists = await User.findById(_id);
  let updatedUser;

  if (!userExists) {
    console.log("User not found.");
    res.status(404);
    throw new Error("User not found.");
  }
  const userHasActiveSub = await User.find({
    _id: _id,
    "activeSub.active": true,
  });

  if (userHasActiveSub.length > 0) {
    res.status(400);
    throw new Error(
      "You can't subscribe at the moment because you still have an active subscription."
    );
  }

  var config = {
    method: "get",
    url: `https://api.paystack.co/transaction/verify/${reference}`,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_ACC_SECRET_KEY}`,
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(async function (response) {
      const res = response.data.data;
      const cus = response.data.data.customer;
      const newSub = await new Subscription({
        message,
        reference,
        transaction,
        amount,
        plan,
        user: {
          username,
          userId: _id,
          email,
        },
        paymentCustomer: {
          id: cus.id,
          first_name: cus.first_name,
          last_name: cus.last_name,
          email: cus.email,
          customer_code: cus.customer_code,
          phone: cus.phone,
        },
        authorization: res.authorization,
        paymentData: {
          domain: res.domain,
          status: res.status,
          reference: res.reference,
          amount: res.amount / 100,
          paid_at: res.paid_at,
          created_at: res.created_at,
          channel: res.channel,
          currency: res.currency,
          ip_address: res.ip_address,
        },
        log: res.log,
      });

      userExists.subCount = userExists.subCount + 1;
      userExists.activeSub.active = true;
      userExists.activeSub.createdDate = reference;
      userExists.activeSub.duration = Number(duration);
      userExists.activeSub.expiryDate = generateExpiryDate(
        Number(reference),
        Number(duration)
      ).expiryDateNumber;
      userExists.activeSub.expiryDateLiteral = generateExpiryDate(
        Number(reference),
        Number(duration)
      ).expiryDateLiteral;
      userExists.activeSub.plan = plan;
      userExists.activeSub.amount = amount;
      userExists.activeSub.currency = res.currency;

      const subSaved = await newSub.save();
      updatedUser = await userExists.save();
    })

    .catch(function (error) {
      console.log(error);
    });

  if (updatedUser) {
    res.send({ message: "Payment has been successfully confirmed." });
  }

  res.end();
});
/**
 * @description This is not a route
 * @description It clears expired subscriptions
 */
setInterval(
  (function () {
    async function loop() {
      const subs = await User.find({
        "activeSub.expiryDate": {
          $lte: Date.now(),
        },
      });

      if (subs.length > 0) {
        subs.forEach(async (user) => {
          const theUser = await User.findById(user._id);

          // EDit the user model
          const r = theUser.activeSub;

          r.active = false;
          r.createdDate = null;
          r.expiryDate = null;
          r.expiryDateLiteral = null;
          r.plan = null;
          r.amount = null;
          r.currency = null;
          r.duration = null;

          const saved = await theUser.save();
          // if (saved) {
          //   console.log(saved);
          // }
        });
      } else {
        console.log("There are no expired subscriptions anymore.");
      }
    }

    loop();
    return loop;
  })(),
  // One hour
  1000 * 60 * 60
);

/**
 * @description This sends the admin every user with an active subscription
 * @description It also depends on pageNumber query to determine the pagination
 * @description The routes are GET request of /api/subscriptions/active-subscriptions/?pageNumber=theNumber
 * @access This a private routes for admins only
 */

const getActiveSubsUser = asyncHandler(async (req, res) => {
  const pageSize = 1;
  const page = Number(req.query.pageNumber) || 1;

  const countSubsUser = await User.countDocuments({
    "activeSub.active": true,
  });

  const activeSubsUser = await User.find({
    "activeSub.active": true,
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({
      "activeSub.createdDate": -1,
    });

  if (activeSubsUser.length > 0) {
    res.send({
      activeSubsUser,
      page,
      pages: Math.ceil(countSubsUser / pageSize),
    });
  } else {
    res.status(400);
    throw new Error(
      "There are no user with an active subscriptions at the moment."
    );
  }
});

/**
 * @description This checks if a user has an active subscription
 * @description The routes are GET request of /api/subscriptions/active-subscriptions/:id
 * @access This a private routes for admins only || that particular user
 */

const getSingleActiveSub = asyncHandler(async (req, res) => {
  const user = req.user;
  const e = req.params.id;

  if (user.isAdmin || Number(user._id) === Number(e)) {
    res.status(401);
    throw new Error("You are not authorized to use this route.");
  }

  const userHasActiveSub = await User.findOne({
    _id: user._id,
    "activeSub.active": true,
  });

  if (userHasActiveSub) {
    res.send(userHasActiveSub);
  } else {
    res.status(404);
    throw new Error("User has no active sub at the moment.");
  }
});

module.exports = {
  sendPaystackConfig,
  confirmPayment,
  getActiveSubsUser,
  getSingleActiveSub,
};

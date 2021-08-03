const axios = require("axios");
const FormData = require("form-data");
const data = new FormData();
const AsyncHandler = require("express-async-handler");
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
 * @access This a private routes
 */

const confirmPayment = AsyncHandler(async (req, res) => {
  try {
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
    const { username, name, email, _id } = req.user;

    const userExists = await User.findById(_id);
    let updatedUser;

    if (!userExists) {
      console.log("User not found.");
      res.status(404);
      throw new Error("User not found.");
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
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  sendPaystackConfig,
  confirmPayment,
};

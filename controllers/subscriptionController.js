// {
//     message: "Approved"
// reference: "1627816914643"
// status: "success"
// trans: "1246227632"
// transaction: "1246227632"
// trxref: "1627816914643"
// }
// const options = {
//   hostname: "api.paystack.co",
//   port: 443,
//   path: `/transaction/verify/1627929802742`,
//   method: "GET",
//   headers: {
//     Authorization: `Bearer ${process.env.PAYSTACK_ACC_SECRET_KEY}`,
//   },
// };

// const https = require("https");
// try {
//   https
//     .request(options, (res) => {
//       let data = "";
//       res.on("data", (chunk) => {
//         data += chunk;
//       });
//       res.on("end", () => {
//         console.log(JSON.parse(data));
//       });
//     })
//     .on("error", (error) => {
//       console.error(error);
//     });
// } catch (error) {
//   console.log(error);
// }
// {
//     "status": true,
//     "message": "Verification successful",
//     "data": {
//       "amount": 27000,
//       "currency": "NGN",
//       "transaction_date": "2016-10-01T11:03:09.000Z",
//       "status": "success",
//       "reference": "DG4uishudoq90LD",
//       "domain": "test",
//       "metadata": 0,
//       "gateway_response": "Successful",
//       "message": null,
//       "channel": "card",
//       "ip_address": "41.1.25.1",
//       "log": {
//         "time_spent": 9,
//         "attempts": 1,
//         "authentication": null,
//         "errors": 0,
//         "success": true,
//         "mobile": false,
//         "input": [],
//         "channel": null,
//         "history": [{
//           "type": "input",
//           "message": "Filled these fields: card number, card expiry, card cvv",
//           "time": 7
//           },
//           {
//             "type": "action",
//             "message": "Attempted to pay",
//             "time": 7
//           },
//           {
//             "type": "success",
//             "message": "Successfully paid",
//             "time": 8
//           },
//           {
//             "type": "close",
//             "message": "Page closed",
//             "time": 9
//           }
//         ]
//       }
//       "fees": null,
//       "authorization": {
//         "authorization_code": "AUTH_8dfhjjdt",
//         "card_type": "visa",
//         "last4": "1381",
//         "exp_month": "08",
//         "exp_year": "2018",
//         "bin": "412345",
//         "bank": "TEST BANK",
//         "channel": "card",
//         "signature": "SIG_idyuhgd87dUYSHO92D",
//         "reusable": true,
//         "country_code": "NG",
//         "account_name": "BoJack Horseman"
//       },
//       "customer": {
//         "id": 84312,
//         "customer_code": "CUS_hdhye17yj8qd2tx",
//         "first_name": "BoJack",
//         "last_name": "Horseman",
//         "email": "bojack@horseman.com"
//       },
//       "plan": "PLN_0as2m9n02cl0kp6",
//       "requested_amount": 1500000
//     }
//   }

// const config = {
//     reference: new Date().getTime().toString(),
//     email: "bonarhyme@protonmail.com",
//     amount: 20000,
//     publicKey: "pk_test_e59723a0403a7fe619c62c88b775e394fe471f69",
//   };

const axios = require("axios");
const FormData = require("form-data");
const data = new FormData();
const AsyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");
const User = require("../models/userModel");

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
    } = req.body;
    const { username, name, email, _id } = req.user;

    const userExists = await User.findById(_id);

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

        const subSaved = await newSub.save();
      })
      .catch(function (error) {
        console.log(error);
      });

    // userExists.subCount = userExists.subCount + 1;
    // userExists.activeSub.active = true;
    // userExists.activeSub.createdDate = reference;
    // userExists.activeSub.plan = plan;
    // userExists.activeSub.amount = amount;

    // const updatedUser = await userExists.save();

    // if (updatedUser) {
    //   res.send({ message: "Successfully made payment." });
    // }
    res.end();
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  sendPaystackConfig,
  confirmPayment,
};

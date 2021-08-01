// {
//     message: "Approved"
// reference: "1627816914643"
// status: "success"
// trans: "1246227632"
// transaction: "1246227632"
// trxref: "1627816914643"
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

module.exports = {
  sendPaystackConfig,
};

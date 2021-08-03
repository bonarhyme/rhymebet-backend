var axios = require("axios");
var FormData = require("form-data");
var data = new FormData();

var config = {
  method: "get",
  url: "https://api.paystack.co/transaction/verify/1627988407584",
  headers: {
    Authorization: "Bearer sk_test_e81fd9fb28052f9ed7e90b402c57a1491a86e09c",
    ...data.getHeaders(),
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

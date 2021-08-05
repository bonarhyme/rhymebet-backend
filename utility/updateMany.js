const expressAsyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");

const updateMany = expressAsyncHandler(async function updateMany() {
  const subs = await Subscription.find();
  //     const updated = await Subscription.updateMany(
  //       {},
  //       {
  //         $set: {
  //           expiryDate:
  //             "Thu Aug 19 2021 11:18:00 GMT+0100 (West Africa Standard Time)",
  //         },
  //       },
  //       { multi: true, upsert: false }
  //     );

  //     if (updated) {
  //   console.log(updated);
  //     }

  if (subs) {
    console.log(subs);
  }
});

// updateMany();

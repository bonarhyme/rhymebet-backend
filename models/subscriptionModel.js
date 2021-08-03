const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    reference: { type: String, required: true },
    status: { type: String, required: true },
    trans: { type: String, required: true },
    transaction: { type: String, required: true },
    trxref: { type: String, required: true },
    amount: { type: Number, required: true },
    plan: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;

const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    reference: { type: String, required: true },

    transaction: { type: String, required: true },
    amount: { type: Number, required: true },
    plan: { type: String, required: true },
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },

    paymentCustomer: {
      id: {
        type: Number,
      },
      first_name: {
        type: String,
      },
      last_name: {
        type: String,
      },
      email: {
        type: String,
      },
      customer_code: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    paymentData: {
      domain: {
        type: String,
      },
      status: {
        type: String,
      },
      reference: {
        type: String,
      },
      amount: {
        type: Number,
      },
      paid_at: {
        type: String,
      },
      created_at: {
        type: String,
      },
      channel: {
        type: String,
      },
      currency: {
        type: String,
      },
      ip_address: {
        type: String,
      },
    },
    authorization: {
      authorization_code: {
        type: String,
      },
      bin: {
        type: String,
      },
      last4: {
        type: String,
      },
      exp_month: {
        type: String,
      },
      exp_year: {
        type: String,
      },
      channel: {
        type: String,
      },
      card_type: {
        type: String,
      },
      bank: {
        type: String,
      },
      country_code: {
        type: String,
      },
      brand: {
        type: String,
      },
      reusable: {
        type: Boolean,
      },
      signature: {
        type: String,
      },
      account_name: {
        type: String,
      },
      receiver_bank_account_number: {
        type: String,
      },
      receiver_bank: {
        type: String,
      },
    },
    log: {
      start_time: {
        type: Number,
      },
      time_spent: {
        type: Number,
      },
      attempts: {
        type: Number,
      },
      errors: {
        type: Number,
      },
      success: {
        type: Boolean,
      },
      mobile: {
        type: Boolean,
      },
      input: {
        type: Array,
      },
      history: {
        type: Array,
      },
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;

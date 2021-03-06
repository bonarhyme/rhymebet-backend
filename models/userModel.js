const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    referral: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    token: {
      type: String,
    },
    subCount: {
      type: Number,
      default: 0,
    },

    activeSub: {
      active: {
        type: Boolean,
        default: false,
      },
      createdDate: {
        type: String,
        default: null,
      },
      duration: {
        type: Number,
        default: null,
      },
      expiryDate: {
        type: String,
        default: null,
      },
      expiryDateLiteral: {
        type: String,
        default: null,
      },
      plan: {
        type: String,
        default: null,
      },
      amount: {
        type: Number,
        default: null,
      },
      currency: {
        type: String,
        default: null,
      },
    },
    activePromo: {
      active: {
        type: Boolean,
        default: false,
      },
      createdDate: {
        type: String,
        default: null,
      },
      expiryDate: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 *
 * @param {*} enteredPassword - or The user's password
 * @returns if password matches the user's password in the database
 */

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * @description This rehashes a password if updated or changed.
 */
userSchema.pre("save", async function (next) {
  // This first one checks to see that it doesnt rehash a password on login or registe
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;

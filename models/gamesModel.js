const mongoose = require("mongoose");

const aGameSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    league: {
      type: String,
      default: "-",
    },
    leagueFull: {
      type: String,
      default: "-",
    },
    country: {
      type: String,
      default: "-",
    },
    countryFull: {
      type: String,
      default: "-",
    },
    clubs: {
      type: String,
      default: "-",
    },
    clubsFull: {
      type: String,
      default: "-",
    },
    win: {
      type: String,
      default: "-",
    },
    ov: {
      type: String,
      default: "-",
    },
    gg: {
      type: String,
      default: "-",
    },
    corner: {
      type: String,
      default: "-",
    },
    wasWon: {
      type: Boolean,
      default: null,
    },
    matchTime: {
      type: String,
      default: "-",
    },
  },

  {
    timestamps: true,
  }
);

const creatorSchema = mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    creatorUsername: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const gamesSchema = mongoose.Schema(
  {
    creator: [creatorSchema],
    games: [aGameSchema],
    isFree: {
      type: Boolean,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const gamesModel = mongoose.model("Game", gamesSchema);
module.exports = gamesModel;

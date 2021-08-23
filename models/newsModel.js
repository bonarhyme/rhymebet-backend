// title, image, fullStory
const mongoose = require("mongoose");

const date = new Date();

const replySchema = mongoose.Schema(
  {
    username: {
      type: String,
      default: "guest",
    },
    reply: {
      type: String,
      default: "",
    },
    createdAt: {
      type: String,
      default: date,
    },
  },
  { timestamps: true }
);

const commentSchema = mongoose.Schema(
  {
    username: {
      type: String,
      default: "guest",
    },
    comment: {
      type: String,
      default: "",
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

const imageSchema = mongoose.Schema(
  {
    url: {
      type: String,

      default: "",
    },
  },
  { timestamps: true }
);
const newsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    images: [imageSchema],
    fullStory: {
      type: String,
      required: true,
    },
    comment: [commentSchema],
    poster: {
      username: {
        type: String,
        required: true,
        default: "",
      },
      userId: {
        type: String,
        required: true,
        default: "",
      },
    },
  },
  { timestamps: true }
);

const NewsModel = mongoose.model("News", newsSchema);

module.exports = NewsModel;

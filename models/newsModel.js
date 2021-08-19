// title, image, fullStory
const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

const NewsModel = mongoose.model("News", newsSchema);

module.exports = NewsModel;

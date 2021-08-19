const express = require("express");
const asyncHandler = require("express-async-handler");

const cloudinaryImp = require("../utility/imageUpload");
const News = require("../models/newsModel");

const createNews = asyncHandler(async (req, res) => {
  try {
    let pictureFiles = req.files;
    let user = req.user;
    let { title, fullStory } = req.body;

    if (!pictureFiles) {
      res.status(400);
      throw new Error("No picture attached!");
    }

    let multiplePicturePromise = pictureFiles.map((picture, index) =>
      cloudinaryImp.uploader.upload(picture.path, {
        public_id: `${Date.now()}_${user.username}_${index}`,
        height: 600,
        width: 600,
        crop: "fill",
      })
    );

    const imageResponse = await Promise.all(multiplePicturePromise);
    const imagesUrl = imageResponse.map((image) => {
      const url = image.secure_url;
      return { url };
    });

    const newNews = await News.create({
      title,
      fullStory,
      images: imagesUrl,
    });

    if (newNews) {
      //   console.log(newNews);
      res.send({
        message: "News has been created.",
        newNews,
      });
    } else {
      res.status(500);
      throw new Error("Server error, try again.");
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    throw new Error(error.message);
  }
});

module.exports = { createNews };

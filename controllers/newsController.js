const express = require("express");
const asyncHandler = require("express-async-handler");

const cloudinaryImp = require("../utility/imageUpload");
const News = require("../models/newsModel");
const NewsModel = require("../models/newsModel");

/**
 * @description This creates news and adds image to cloudinary
 * @description The routes are GET request of /api/news/create
 * @access This is for admins alone
 */

const createNews = asyncHandler(async (req, res) => {
  try {
    let pictureFiles = req.files;
    let user = req.user;
    let { title, fullStory } = req.body;

    const findNews = await NewsModel.findOne({ title });

    if (findNews) {
      res.status(400);
      throw new Error("Please use another title.");
    }

    if (!pictureFiles) {
      res.status(400);
      throw new Error("No picture attached!");
    }

    let multiplePicturePromise = pictureFiles.map((picture, index) =>
      cloudinaryImp.uploader.upload(picture.path, {
        public_id: `${Date.now()}_${user.username}_${index}`,
        height: 400,
        width: 400,
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
      poster: {
        username: user.username,
        userId: user._id,
      },
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
    // console.log(error);
    throw new Error(error.message);
  }
});

/**
 * @description This checks lists all the news and requires pageNumber to display pagination
 * @description The routes are GET request of /api/news/all
 * @example /api/news/all/?pageNumber=theNumber
 */
const getNews = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await NewsModel.countDocuments({});

  const allNews = await NewsModel.find({})
    .select("-comment")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({
      createdAt: -1,
    });

  if (allNews) {
    res.send({ allNews, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(400);
    throw new Error("No news available.");
  }
});

/**
 * @description This gets single news
 * @description The routes are GET request of /api/news/:id
 * @example /api/news/:id/
 */

const getSingleNews = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const news = await NewsModel.findById(id);

  if (news) {
    res.send(news);
  } else {
    res.status(404);
    throw new Error("News not found.");
  }
});
module.exports = { createNews, getNews, getSingleNews };

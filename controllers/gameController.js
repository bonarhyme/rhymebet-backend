const Games = require("../models/gamesModel");
const asyncHandler = require("express-async-handler");

/**
 * @description This creates
 * @description The routes are POST request of /api/games/create
 * @access This is an admin or super admin only page
 */
const createGames = asyncHandler(async (req, res) => {
  const creatorId = req.user._id;
  const creatorUsername = req.user.username;

  const newGame = await new Games({
    games: req.body.games,
    creator: {
      creatorId,
      creatorUsername,
    },
    isFree: req.body.isFree,
  });

  const createdNewGame = await newGame.save();

  if (createdNewGame) {
    res.send({
      message: "The new games has been created successfully",
      createdNewGame,
    });
  } else {
    res.status(500);
    throw new Error("Creation of games failed. Please try again later.");
  }
});

module.exports = {
  createGames,
};

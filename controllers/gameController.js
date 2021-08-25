const Games = require("../models/gamesModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * @description This creates a new game
 * @description The routes are POST request of /api/games/create
 * @access This is an admin or super admin only page
 */
const createGames = asyncHandler(async (req, res) => {
  // console.log(req.body.games);
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

/**
 * @description This sends the admin the list of every games posted
 * @description It depends on query param to determine if it will contains list of free games or not
 * @description It also fetches free depending on the creator's username or Id. It utiliziles keywords passed in as query to do so.
 * @description It also paginates the list of games if passed if pageNumber is passed
 * @requires The routes are GET request of /api/games/list
 * @example 1. /api/games/list/?isFree=false&creator=bonarhyme&pageNumber=1
 * @access This is apublic
 */

const getGames = asyncHandler(async (req, res) => {
  const isFree = true;
  const creator = req.query.creator;
  // ? {
  //     [creator.creatorUsername]: {
  //       $regex: req.query.creator,
  //       $options: "i",
  //     },
  //   }
  // : {};

  const pageSize = 1;
  const page = Number(req.query.pageNumber) || 1;

  let games, count;

  if (creator) {
    count = await Games.countDocuments({
      isFree,
      "creator.creatorUsername": `${creator}`,
    });

    // db.domain.find( {tag : {$exists:true}, $where:'this.tag.length>3'} )
    games = await Games.find({
      isFree,
      "creator.creatorUsername": `${creator}`,
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({
        createdAt: -1,
      });
  } else {
    count = await Games.countDocuments({
      isFree,
    });

    games = await Games.find({
      isFree,
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({
        createdAt: -1,
      });
  }

  if (games.length > 0) {
    res.send({ games, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(404);
    throw new Error("Games not found.");
  }
});

/**
 * @description This sends the admin the list of every premium games posted
 * @description It depends on query param to determine if it will contains list of free games or not
 * @description It also fetches free or premium games depending on the creator's username or Id. It utiliziles keywords passed in as query to do so.
 * @description It also paginates the list of games if passed if pageNumber is passed
 * @requires The routes are GET request of /api/games/list/premium
 * @example 1. /api/games/list/premium/?isFree=false&creator=bonarhyme&pageNumber=1
 * @access This is an admin or super admin or user with an active sub
 */

const getPremiumGames = asyncHandler(async (req, res) => {
  let games, count, token;
  const isFree = false;
  const creator = req.query.creator;

  const pageSize = 1;
  const page = Number(req.query.pageNumber) || 1;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1] !== null
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      // If user is admin
      if (user && user.isAdmin) {
        // If user is admin and creator passed as query
        if (creator) {
          count = await Games.countDocuments({
            isFree,
            "creator.creatorUsername": `${creator}`,
          });

          games = await Games.find({
            isFree,
            "creator.creatorUsername": `${creator}`,
          })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({
              createdAt: -1,
            });
          // If user is admin and creator is not passed as query
        } else {
          count = await Games.countDocuments({
            isFree,
          });

          games = await Games.find({
            isFree,
          })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({
              createdAt: -1,
            });
        }
      } else {
        // Active sub
        if ((user && user.activeSub.active) || user.activePromo.active) {
          // If user has active sub and creator is passed as query
          if (creator) {
            count = await Games.countDocuments({
              isFree,
              "creator.creatorUsername": `${creator}`,
            });

            games = await Games.find({
              isFree,
              "creator.creatorUsername": `${creator}`,
            })
              .limit(pageSize)
              .skip(pageSize * (page - 1))
              .sort({
                createdAt: -1,
              });
            // If user has active sub and creator is not passed as query
          } else {
            count = await Games.countDocuments({
              isFree,
            });

            games = await Games.find({
              isFree,
            })
              .limit(pageSize)
              .skip(pageSize * (page - 1))
              .sort({
                createdAt: -1,
              });
          }
          // Valid User doesn't have an active sub
        } else {
          //Valid User doesn't have an active sub and creator is passed
          if (creator) {
            count = await Games.countDocuments({
              isFree,
              "creator.creatorUsername": `${creator}`,
            });

            games = await Games.find({
              isFree,
              "creator.creatorUsername": `${creator}`,
            })
              .select([
                "-games.win",
                "-games.ov",
                "-games.gg",
                "-games.corner",
                "-games.wasWon",
              ])
              .limit(pageSize)
              .skip(pageSize * (page - 1))
              .sort({
                createdAt: -1,
              });
          } else {
            // Valid User doesn't have an active sub and creator is not passed

            count = await Games.countDocuments({
              isFree,
            });

            games = await Games.find({
              isFree,
            })
              .select([
                "-games.win",
                "-games.ov",
                "-games.gg",
                "-games.corner",
                "-games.wasWon",
              ])
              .limit(pageSize)
              .skip(pageSize * (page - 1))
              .sort({
                createdAt: -1,
              });
          }
        }
      }
    } catch (error) {
      console.error({
        serverError: error.message,
        stack: "JWT in Premium games *Game Controller* line 129",
      });
      // Not a valid user and creator is  passed
      if (creator) {
        count = await Games.countDocuments({
          isFree,
          "creator.creatorUsername": `${creator}`,
        });

        games = await Games.find({
          isFree,
          "creator.creatorUsername": `${creator}`,
        })
          .select([
            "-games.win",
            "-games.ov",
            "-games.gg",
            "-games.corner",
            "-games.wasWon",
          ])
          .limit(pageSize)
          .skip(pageSize * (page - 1))
          .sort({
            createdAt: -1,
          });
      } else {
        // Not a valid user and creator is not passed

        count = await Games.countDocuments({
          isFree,
        });

        games = await Games.find({
          isFree,
        })
          .select([
            "-games.win",
            "-games.ov",
            "-games.gg",
            "-games.corner",
            "-games.wasWon",
          ])
          .limit(pageSize)
          .skip(pageSize * (page - 1))
          .sort({
            createdAt: -1,
          });
      }
    }
    // A Visitor
  } else {
    // Visitor and creator is  passed
    if (creator) {
      count = await Games.countDocuments({
        isFree,
        "creator.creatorUsername": `${creator}`,
      });

      games = await Games.find({
        isFree,
        "creator.creatorUsername": `${creator}`,
      })
        .select([
          "-games.win",
          "-games.ov",
          "-games.gg",
          "-games.corner",
          "-games.wasWon",
        ])
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({
          createdAt: -1,
        });
    } else {
      // Visitor and creator is not passed

      count = await Games.countDocuments({
        isFree,
      });

      games = await Games.find({
        isFree,
      })
        .select([
          "-games.win",
          "-games.ov",
          "-games.gg",
          "-games.corner",
          "-games.wasWon",
        ])
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({
          createdAt: -1,
        });
    }
  }

  if (games && games.length > 0) {
    res.send({ games, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(404);
    throw new Error("Games not found.");
  }
});

/**
 * @description This updates the status of a particular game or sets it to win or failed
 * @description It depends on param to determine the game
 * @requires The routes are PuT request of /api/games/list/game/update/:id/?status=won || failed
 * @access This is an admin or super admin only page
 *
 */

const updateParticularGame = asyncHandler(async (req, res) => {
  try {
    const theGameId = req.params.id;
    const theNotice = req.query.status;

    const theGame = await Games.updateOne(
      {
        "games._id": theGameId,
      },

      {
        $set: {
          "games.$.wasWon":
            theNotice === "won" ? true : theNotice === "failed" ? false : null,
        },
      }
    );

    if (!theGame) {
      res.status(404);
      throw new Error("The game does not exist.");
    }

    if (theGame) {
      res.send({ message: "Game has been updated successfully." });
    }
  } catch (error) {
    res.status(400);
    throw new Error(
      "There seem to be an error updating the game. Please try agin later."
    );
  }
});

/**
 * @description This deletes  a particular game
 * @description It depends on param to determine the game
 * @requires The routes are Delete request of /api/games/list/game/delete/:id
 * @access This is an admin or super admin only page
 *
 */

const deleteParticularGame = asyncHandler(async (req, res) => {
  try {
    const theGameId = req.params.id;

    const theGame = await Games.updateOne(
      { "games._id": theGameId },

      {
        $pull: {
          games: { _id: theGameId },
        },
      }
    );

    if (!theGame) {
      res.status(404);
      throw new Error("The game does not exist.");
    }

    if (theGame) {
      res.send({ message: "Game has been deleted successfully." });
    }
  } catch (error) {
    res.status(400);
    throw new Error(
      "There seem to be an error deleting the game. Please try again later."
    );
  }
});

module.exports = {
  createGames,
  getGames,
  updateParticularGame,
  deleteParticularGame,
  getPremiumGames,
};

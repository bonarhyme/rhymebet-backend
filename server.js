// const sanitizeNosqlQuery = require("express-mongo-sanitize");
// const rateLimiter = require("express-rate-limit");

// app.use(
//   "/api",
//   rateLimiter({
//     max: 1000,
//     windowMs: 1000 * 60 * 60,
//     message: "Too many requests from this IP. Try again in an hour.",
//   })
// );
// app.use(sanitizeNosqlQuery());

const express = require("express");
const app = express();
const cors = require("cors");
const variables = require("./data/appData");

require("dotenv/config");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const gamesRoutes = require("./routes/gamesRoutes");

// Parse JSON
app.use(express.json());

const corsOptions = {
  origin: variables.frontendLink,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Connect Database
connectDB();

// Middlewares
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

//User routes
app.use("/api/user", userRoutes);

//Game routes
app.use("/api/games", gamesRoutes);

//Not found URL middleware
app.use(notFound);

//Error handler for the whole app
app.use(errorHandler);

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

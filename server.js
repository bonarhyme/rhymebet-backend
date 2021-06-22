const express = require("express");
const app = express();
const cors = require("cors");
const variables = require("./data/appData");

require("dotenv/config");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

// Parse JSON
app.use(express.json());

// Cors
// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
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

//Not found URL middleware
app.use(notFound);

//Error handler for the whole app
app.use(errorHandler);

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

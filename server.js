const express = require("express");
const app = express();

require("dotenv/config");

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

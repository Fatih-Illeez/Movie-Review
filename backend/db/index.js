const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Movie-Review")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("database error", err);
  });

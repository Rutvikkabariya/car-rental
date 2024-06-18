const mongoose = require("mongoose");

const Feedback = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

module.exports = mongoose.model("Feedback Data", Feedback);

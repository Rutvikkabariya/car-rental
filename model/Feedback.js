const mongoose = require("mongoose");

const Feedback = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    min:10,
    max:50,
    required: true
  },
});

module.exports = mongoose.model("Feedback", Feedback);

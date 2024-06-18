const mongoose = require("mongoose");

const Contact = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
});

module.exports = mongoose.model("Contact Data", Contact);

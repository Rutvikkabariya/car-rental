const mongoose = require("mongoose");

const Contact = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
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

module.exports = mongoose.model("Contact Data", Contact);

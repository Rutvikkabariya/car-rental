const mongoose = require("mongoose");

const AddDriver = new mongoose.Schema({
    driver: String,
    phone: String,
    email: String,
    licence: String,
    alternativephone: String,
    state: String

});

module.exports = mongoose.model("Driver Data", AddDriver);

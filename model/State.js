const mongoose = require("mongoose");

const AddState = new mongoose.Schema({
    state: String,

});

module.exports = mongoose.model("AddState Data", AddState);

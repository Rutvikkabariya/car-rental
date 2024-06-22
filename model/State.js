const mongoose = require("mongoose");

const AddState = new mongoose.Schema({
    state: {
        type: String,
        required: true
      },

});

module.exports = mongoose.model("StateData", AddState);

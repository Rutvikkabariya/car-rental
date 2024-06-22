const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    driver: {
        type: String,
        required: true
      },
    phone: {
        type: Number,
        required: true
      },
    email: {
        type: String,
        required: true
      },
    license: {
        type: Number,
        required: true
      },
    alternativephone: {
        type: Number,
        required: true
      },
    state: {
        type: String,
        required: true
      }

});

module.exports = mongoose.model("Driver", driverSchema);

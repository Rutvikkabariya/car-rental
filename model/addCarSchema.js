const mongoose = require("mongoose");

const AddCar = new mongoose.Schema({
  car_name: {
    type: String,
    required: true
  },
  car_brand: {
    type: String,
    required: true
  },
  detail: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  km: {
    type: Number,
    required: true
  },
  platnumber: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("AddCar Data", AddCar);

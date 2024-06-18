const mongoose = require("mongoose");
const schema = mongoose.Schema;

const CarBook = new schema({
  user_id: {
    type: schema.Types.ObjectId,
    require: true
},
  name: String,
  phone: String,
  email: String,
  car: {
    type: String,
    items: {
        enum: ["sa", "saa"]
    }
  },
  drive: String,
  state: String,
  pickup: String,
  drop: String,
  date: String,
  drivername: String,
  driverphone: String,
  card :String,
  card_no:Number,
  cvv:Number
});

module.exports = mongoose.model("CarBooking", CarBook);

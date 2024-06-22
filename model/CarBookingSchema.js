const mongoose = require("mongoose");
const schema = mongoose.Schema;

const bookingSchema = new schema({
    user_id: {
      type: schema.Types.ObjectId,
      require: true
    },
    name: {
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
    car: {
      type: String,
      items: {
        enum: ["sa", "saa"]
      }
    },
    drive: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pickup: {
      type: String,
      required: true
    },
    drop: {
      type: String,
      required: true
    },
    date: String,
    drivername: {
      type: String,
      required: true
    },
    driverphone: {
      type: Number,
      required: true
    },
    card: {
      type: Number,
      required: true
    },
    card_no: {
      type: Number,
      required: true
    },
    cvv: {
      type: Number,
      required: true
    }

});

module.exports = mongoose.model("CarBooking", bookingSchema);

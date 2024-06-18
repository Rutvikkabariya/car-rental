const Car = require("../model/addCarSchema");
const UserSchema = require('../model/UserSchema')
const Booking = require('../model/CarBookingSchema')
const mongodb = require("mongodb");



// get AddCar page
const getAddCar = (req, res) => {
  res.render('admin/add_car',{layout:'./admin/layout/master_app'})
}

// Add Car_Data
const addCar = async (req, res) => {
  const { car_name, car_brand,detail, model, km, platnumber,price } = req.body;

  console.log(req.body)

  // if(!req.session.user.role)

  try {
    const user = new Car({
      car_name,
      car_brand,
      detail,
      model,
      km,
      platnumber,
      image: req.file.originalname,
      price
    });
    user.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/admin');
      }
    });
  } catch (error) {
    res.json({ message: error })
  }

};

// Car Data Get
const allCarData = async (req, res) => {
  Car.find({}, function (err, data) {
    if (err) {
      res.send({ message: "don't get data" });
    } else {
        res.render('frontend/allcar',{data})
    }
  });
};

// Car Update send id
const car_updateId = async (req, res) => {
  const data = await Car.findOne({
    _id: new mongodb.ObjectId(req.params.id),
  });
  res.send(data);
};

// Car Update
const carUpdate = async (req, res, next) => {

  const { carname, carbrand, platnumber } = req.body

  await Car.findByAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        carname: carname,
        carbrand: carbrand,
        platnumber: platnumber
      },
    }
  )
    .then((result) => {
      res.status(200).json({
        User: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

// Car Delete
const car_dlt = async (req, res) => {
  const data = await Car.findByIdAndDelete({
    _id: req.params.id
  });
  res.redirect('/admin')
};



module.exports = {
  
  getAddCar,
  addCar,
  allCarData,
  car_updateId,
  carUpdate,
  car_dlt
};
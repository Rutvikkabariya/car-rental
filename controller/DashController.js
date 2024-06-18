const Car = require("../model/addCarSchema");
const UserSchema = require('../model/UserSchema')
const Booking = require('../model/CarBookingSchema')
const Feedback = require('../model/Feedback')


// Dash Board
const Dashboard =async(req,res)=>{
  const data = await Car.find();
  const feed = await Feedback.find();
  res.render('frontend/dashboard',{layout : false, data,feed})
}


// user home page
const home = async(req, res) => {
  const data = await Car.find();
  const feed = await Feedback.find();
  res.render('frontend/home',{data,feed})
}

const AboutUs = (req, res) => {
  res.render('frontend/aboutus')
}


// admin dashboard
const admin = async (req, res) => {

  const user = await UserSchema.find().count();
  const booking = await Booking.find().count();
  const car = await Car.find().count();

  const data = await Car.find()
  res.render('admin/admin_dash', { 
    layout: './admin/layout/master_app', 
    data, 
    user, 
    booking, 
    car 
  })
}



module.exports = {
  Dashboard,
  admin,
  home,
  AboutUs
}
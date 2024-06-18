const { response } = require("express");
const Contact = require("../model/Contact");
const mongodb = require("mongodb");
const Joi = require("joi");

// joi validation
const validate = Joi.object({
  name: Joi.string().required().min(3).max(25),
  email: Joi.string().email().required().min(3).max(25),
  phone: Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1).required(),
  message: Joi.string().min(10).max(50).required()
});


// user page contactUs
const userContactUs = (req, res) => {

  res.render('frontend/contactUs')

}


// Comment Data - ContactUs
const contactUs = async (req, res) => {

  // joi validation
  const { error: error } = validate.validate(req.body, { abortEarly: false })
  if (error) {
    req.session.error = error.details
    console.log(error, 'validation Error');
    return res.redirect('back');
  }

  const { name, email, message, phone } = req.body;
  const user = new Contact({
    name,
    phone,
    email,
    message,
  });
  user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.render('frontend/contactUs', { massage: 'Successfully Contact Us' });
    }
  });
};

// Comment send
const getContactUs = async (req, res) => {
  Contact.find({}, function (err, data) {
    if (err) {
      res.send({ message: "don't get data" });
    } else {
      res.render('admin/contactUs', { layout: './admin/layout/master_app', data })
    }
  });
};

// Comment delete
const contactUs_dlt = async (req, res) => {
  console.log(req.params.id)
  const data = await Contact.deleteOne({
    _id: req.params.id,
  });
  res.redirect('/contactUs');
};


module.exports = {
  userContactUs,
  contactUs,
  getContactUs,
  contactUs_dlt
};

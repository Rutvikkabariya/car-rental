const { response } = require("express");
const Feedback = require("../model/Feedback");
var nodemailer = require("nodemailer");
const Joi = require("joi");

// joi validation
const validate = Joi.object({
  name: Joi.string().required().min(3).max(25),
  email: Joi.string().email().required().min(3).max(25),
  message: Joi.string().min(10).max(50).required()
});


// Get Feedback page
const getFeedback = (req, res) => {
  if(req.session.user.role === 'admin'){
    res.render('admin/feedback')
  }
  res.render('frontend/feedback')
}

// Feedback
const feed_back = async (req, res) => {

  // joi validation
  const { error: error } = validate.validate(req.body, { abortEarly: false })
  if (error) {
    req.session.error = error.details
    console.log(error, 'validation Error');
    return res.redirect('back');
  }

  const { name, email, message } = req.body;

  // send mail 
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = `
     <p>Dear <b>${req.body.name}<b></p>
     <p>Thank you for taking the time to provide feedback on speedo car rental Services. 
        Your insight and suggestions were extremely helpful and we greatly appreciate your contribution. 
        We value all feedback and are committed to using it to improve our offerings.</p>
     <p>Best Regards,</p>
     <p>Speedo Car Rental</p>`

  const mailOptions = {
     from: process.env.EMAIL,
     to: email,
     subject: "Thank You for Your Feedback - Speedo car rental",
     html: html
  };

  const sendMail = transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent:" + info.response);
      }
  });
  {
    const user = new Feedback({
        name,
        email,
        message
    });
    user.save((err) => {
      if (err) {
        res.send(err)
      } else {
        sendMail
        res.render('frontend/feedback',{ message: "your feedback is successfully send" });
      }
    });
  }
};

// admin -Feedback Data - Get
const feedback_data = async (req, res) => {

  try{
      Feedback.find({}, function (err, data) {
      if (err) {
        res.send({ message: "don't get data" });
      } else {
        res.render('admin/feedback',{layout:'./admin/layout/master_app',data})
      }
    });

  } catch(err){
    res.send(err)
  }
};

// Feedback delete
const feedback_dlt = async (req, res) => {

  try{
    const data = await Feedback.findByIdAndDelete({
      _id: req.params.id,
    });
    res.redirect('/allFeedback');

  } catch(err){
    res.send(err)
  }

};

module.exports = {
  getFeedback,
  feed_back,
  feedback_data,
  feedback_dlt
};

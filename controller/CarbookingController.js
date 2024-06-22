const { response } = require("express");
const Register = require("../model/UserSchema");
const CarBooking = require("../model/CarBookingSchema");
const CarSchema = require("../model/addCarSchema");
const mongodb = require("mongodb");
const nodemailer = require("nodemailer");
const Joi = require("joi");

// joi validation
const validate = Joi.object({
    // _csrf: Joi.string().required(),
    name: Joi.string().required().min(3).max(25),
    email: Joi.string().email().required().min(3).max(25),
    phone: Joi.number().integer().min(10 ** 9).max(10 ** 10 - 1).required(),
    car: Joi.string().required().min(3).max(15),
    drive: Joi.string().required().min(3).max(25),
    state: Joi.string().min(3).max(15).required(),
    pickup: Joi.string().required().min(3).max(25),
    drop: Joi.string().required().min(3).max(25),
    date: Joi.date().iso().required(),
    card: Joi.string().required().min(3).max(25),
    card_no: Joi.number().integer().min(10 ** 11).max(10 ** 12 - 1).required(),
    cvv: Joi.number().integer().min(10 ** 2).max(10 ** 3 - 1).required()
});

// user get booking page
const getBooking = async (req, res) => {
    try {
      const data = await Register.findOne({ _id: req.session.user._id });
      const c = await CarSchema.findOne({ _id: req.query.id });
      const car = await CarSchema.find();
      res.render('frontend/bookNow', { data, c, car });
    } catch (err) {
      console.log(err)
    }

}

// All Booking admin send
const allBooking = async (req, res) => {
    const data = await CarBooking.find()
    res.render('admin/booking', { layout: './admin/layout/master_app', data })
}


// Booking Data Send
const Booking_data = async (req, res) => {
    CarBooking.find({ user_id: req.session.user._id }, function (err, Product) {
      if (err) {
        res.send({ message: "don't get data" });
      } else {
        res.send(Product);
      }
    });
};


// Car Booking
const CarBook = async (req, res) => {

  // joi validation
    const { error: error } = validate.validate(req.body, { abortEarly: false })
    if (error) {
        req.session.error = error.details
        console.log(error, 'validation Error');
        return res.redirect('back');
    }


    const { name, phone, email, car, drive, state, pickup, drop, date, card, card_no, cvv } = req.body;


  // Send mail 
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        }
    });

    const html =
        `<p>Dear <b>${req.body.name}</b>,</p>
        <p>We hope this email finds you well. We would like to thank you for choosing our car rental services for your upcoming trip. As part of our standard operating procedure, we require all customers to submit their valid identification documents and driving license for verification before finalizing the rental reservation.</p>
        <p>To ensure a smooth and hassle-free car rental experience, we kindly request you to please provide us with the following documents for verification purposes:</p>
        <p>1.	Valid government-issued ID (e.g., passport, national ID card)</p>
        <p>2.	Driver's license (valid and in good standing)</p>
        <p>Please send us the scanned or photo copies of your documents via email at speedocarrental85@gmail.com. We assure you that all information provided will be kept strictly confidential and will only be used for verification purposes.</p>
        <p>Once we have verified your documents, we will confirm your reservation of <b> ${req.body.car} </b> Booked on <b>${req.body.date}</b> at <b>${req.body.pickup}</b> to <b>${req.body.drop}</b> and for additional information we will contact  on >b>${req.body.phone}<b>.We advise you to carefully review the agreement and let us know if you have any questions or concerns.</p>
        <p>Thank you for your cooperation and understanding. We look forward to serving you and providing you with a safe and comfortable car rental experience.</p>
        <p>Best regards,</p>
        <p>Speedo Car Rental </p>`

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Request for Document Verification for Car Rental Reservation - Speedo car rental",
        html: html
    };

    const sendMail = await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email Sent:" + info.response);
        }

    });


    // const ca = await CarSchema.find();

    // for(let car in ca){
    //   if(ca[car].car_name !== name){
    //         console.log('car not found')
    //   }
    // }

    {

      const user = new CarBooking({
        user_id: req.session.user._id,
        name,
        phone,
        email,
        car,
        state,
        drive,
        pickup,
        drop,
        date,
        card,
        card_no,
        cvv
      });

      await user.save((err) => {
        if (err) {
          res.redirect('back');
        } else {
          sendMail
          res.redirect('/invoice')
        }
      });
    }

};

// Upar thi Mail moklyo - cheak kare 6
const mail_get = async (req, res) => {
     await carBook()
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
};


// CarBooking Delete
const Booking_dlt = async (req, res) => {
    const data = await CarBooking.deleteOne({
      _id: req.params.id,
    });
    res.redirect('/booking');
};

// CarBooking Update Id
const Gmail_updateid = async (req, res) => {
    const data = await CarBooking.findOne({
      _id: new mongodb.ObjectId(req.params.id),
    });
    res.send(data);
};

// Update - CarBooking Details
const booking_update = async (req, res, next) => {

   const { name, phone, email, car, drive, state, pickup, drop, date } = req.body;

   // Send mail
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,

      },
    });

    const html =
        `<p>Dear ${req.body.name},</p>
      <p>We hope this email finds you well. We would like to thank you for choosing our car rental services for your upcoming trip. As part of our standard operating procedure, we require all customers to submit their valid identification documents and driving license for verification before finalizing the rental reservation.</p>
      <p>To ensure a smooth and hassle-free car rental experience, we kindly request you to please provide us with the following documents for verification purposes:</p>
      <p>1.	Valid government-issued ID (e.g., passport, national ID card)</p>
      <p>2.	Driver's license (valid and in good standing)</p>
      <p>Please send us the scanned or photo copies of your documents via email at speedocarrental85@gmail.com. We assure you that all information provided will be kept strictly confidential and will only be used for verification purposes.</p>
      <p>Once we have verified your documents, we will confirm your reservation of ${req.body.car}Booked on ${req.body.date} at ${req.body.pickup} to ${req.body.drop} and for additional information we will contact  on ${req.body.phone}.We advise you to carefully review the agreement and let us know if you have any questions or concerns.</p>
      <p>Thank you for your cooperation and understanding. We look forward to serving you and providing you with a safe and comfortable car rental experience.</p>
      <p>Best regards,</p>
      <p>Speedo Car Rental </p>`

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Request for Document Verification for Car Rental Reservation - Speedo car rental",
      html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent:" + info.response);
      }
    });


    CarBooking.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: name,
          phone: phone,
          email: email,
          car: car,
          state: state,
          drive: drive,
          pickup: pickup,
          drop: drop,
          date: date,
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

// Driver Info Send In Email 
const driverSent = async (req, res) => {
  
  const { email, drivername, driverphone } = req.body;

  // Send mail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html =
    `<p>Dear ${req.body.name},</p>
        <p>We're excited to provide you with a safe and comfortable journey with a driver. Your assigned driver is <b>${req.body.drivername}</b>, and you can contact him at  <b>${req.body.driverphone}</b>.</p>
        <p>We've taken all necessary measures to ensure your safety and security during the journey. Our drivers undergo background checks, wear masks at all times, and receive regular safety training.</p>
        <p>If you have any questions or concerns, please let us know.</p>
        <p>Thank you for choosing our car rental service.</p>
        <p>Best regards,</p>
        <p>Sppedo Car Rental </p>`

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Driver Information- Speedo car rental",
    html: html
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent:" + info.response);
    }
  });

};

// receipt send
const receipt = async (req, res) => {

  const receipt = await CarBooking.find({ user_id: req.session.user._id })
    .then((data) => {
      if (!data) {
        res.send('receipt not found')
      }
      res.render('frontend/invoice', { data })
    })
    .catch(err => {
      res.send('Something went wrong');
    });

}

// getPayment
// const Payment = (req,res)=>{
//  res.redirect('/invoice')
// }


module.exports = {
  getBooking,
  allBooking,
  Booking_data,
  CarBook,
  mail_get,
  Gmail_updateid,
  Booking_dlt,
  booking_update,
  driverSent,
  receipt
  // ,
  // Payment
};

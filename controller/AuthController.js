const { response } = require("express");
const UserSchema = require("../model/UserSchema");
const CarBooking = require("../model/CarBookingSchema");
const crypto = require('crypto');
var nodemailer = require("nodemailer");
const { error } = require("console");
const tokenSchema = require("../model/tokenSchema");
const bcrypt = require('bcryptjs');
const Joi = require("joi");



// Get Register page
const getRegister = (req, res) => {
  res.render('frontend/register', { layout: false })
}

// joi validation
const validate = Joi.object({
  // _csrf: Joi.string().required(),
  name: Joi.string().required().min(3).max(25).message({
    "string.pattern.base": "Invalid username",
    "string.min": "minimum 2 character required",
    "string.max": "maximum 30 characters allowed"
  }),
  email: Joi.string().email().required().min(3).max(25),
  password: Joi.string().min(8).max(25).required()
});

// User Register
const register = async (req, res) => {

  // joi validation
  const { error: error } = validate.validate(req.body, { abortEarly: false })
  if (error) {
    req.session.error = error.details
    console.log(error, 'validation Error');
    return res.redirect('back');
  }

  let { name, email, phone, gender, dob, address, password } = req.body;

  console.log('register')

  // Send Mail
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let html = `
    <p>Registration Successful</p>
    <p>Dear ${req.body.name},</p>
    <p>Your registration with our car rental website is complete! You now have access to a variety of vehicles at affordable rates. Simply log in to your account and start browsing.</p>
    <p>Our website is easy to navigate, but our customer support team is available 24/7 if you need assistance. Thank you for choosing us for your transportation needs.</p>
    <p>Best regards,</p>
    <p>Speedo Car Rental </p>
  `

  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Register Information- Speedo car rental",
    html: html
  };

  let mailSend = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent:" + info.response);
    }
  });


  const isMatch = await UserSchema.findOne({ email: email })

    if (isMatch && !req.body) {
      res.render('frontend/register', { layout: false, msg: "already register" });
      return;
    } else {
      let user = new UserSchema({
        name,
        role: 'user',
        email,
        phone,
        gender,
        dob,
        address,
        password,
      });

      user.save((err, result) => {
        if (err) {
          res.send(err);
        } else {
          mailSend
          req.session.user = result;
          if (req.session.user.role === 'user') {
            res.redirect('/home')
          } else {
            res.send('errs')
          }
        }
      });
    }

  return
};

// Get Login page
const getLogin = (req, res) => {
  res.render('frontend/login', { layout: false })
}

// Login
const login = async (req, res) => {

  const { email, password } = req.body;
  console.log('login')

  try {
    const userEmail = UserSchema.findOne({ email: email }, async (err, result) => {
      if (result == null) {
        res.render('frontend/login', { layout: false, msg: 'Email is invalid' })
      } else {
        const isMatch = await bcrypt.compare(password, result.password);
        if (!isMatch) {
          res.render('frontend/login', { layout: false, msg: 'Password is wrong' })
          return;
        }
        req.session.user = result

        if (req.session.user.role === 'user') {
          res.redirect('/home')
        } else {
          // res.send('Done admin')
          res.redirect('/admin')
        }
      }
    })
  } catch (error) {
    res.send("An error occurred");
    console.log(error);
  }

}


// Get forget page
const forgetPage = (req, res) => {
  res.render('frontend/forget', { layout: false })
}

// sendOTP - ForgetPassword
const sendOTP = async (req, res) => {

    const { email } = req.body;

    const token = Math.floor(100000 + Math.random() * 900000)

    // Send Mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Forget Password OTP - Speedo car rental",
      html: `
        <p>Your OTP For Forget Password:</p>
        <p>Please enter this OTP to forget your password </p>
        <h3>${token}</h3>
        `
    };
    // const info = await transporter.sendMail(mailOptions);

    try {
      UserSchema.findOne({ email: email }, async (err, data) => {

        if (!data) {
          res.render('frontend/forget', { layout: false, msg: "Email is not registered" })
        } else {
          console.log(email)
          const tkn = new tokenSchema({
            email: email,
            token: token
          })
          await tkn.save();
          // info
          res.render('frontend/forgetPassword', { layout: false, msg: `After 5 minutes OTP will be expired OTP:${token}`, mail: email })
        }

      })
    }
    catch (err) {
      console.log(err)
    }
    
}

// ForgetPassword
const forgetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const tkn = tokenSchema.findOne({
      email: email,
      token: token
    })

    if (!tkn) { res.render('frontend/forgetPassword', { layout: false, msg: 'Token is invalid' }) }

    let pass = await bcrypt.hash(password, 8)

    await UserSchema.updateOne(
      {
        email: email
      },
      {
        $set: {
          password: pass
        }
      })
      .then((result) => {
        res.render('frontend/forgetPassword', { layout: false, msg: 'Password Is Successfully change' })
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    res.send("An error occurred");
    console.log(error);
  }

};

// logout
const logout = async (req, res) => {
  if (!req.session.destroy()) {
    res.send('Something went wrong')
  }
  res.render('frontend/login', { layout: false })
}



module.exports = {
  getRegister,
  register,
  getLogin,
  login,
  forgetPage,
  sendOTP,
  forgetPassword,
  logout
};
const express = require('express')
const router = express.Router();
const AuthController = require("../controller/AuthController.js");
const DashboardController = require("../controller/DashController.js");
const ContactController = require("../controller/ContactController");
const CarbookingController = require("../controller/CarbookingController");
const FeedbackController = require("../controller/FeedbackController");
const AddCarController = require("../controller/AddCarController");
const StateController = require("../controller/StateController");
const DriverController = require("../controller/DriverController");
const ProfileController = require("../controller/ProfileController");
const middleware = require('../middleware/middleware')
const upload =  require('../middleware/image.js')



// Register User
router.get('/register', AuthController.getRegister)
router.post("/register", AuthController.register);

router.get('/login', AuthController.getLogin)
router.post("/login", AuthController.login);

router.get("/forget", AuthController.forgetPage);
router.post("/otp", AuthController.sendOTP);
router.post("/forget", AuthController.forgetPassword);

// admin dashboard
router.get('/admin',middleware, DashboardController.admin)

// user dashboard
router.get('/', DashboardController.Dashboard)
router.get('/home',middleware, DashboardController.home)

router.get('/aboutUs', middleware,DashboardController.AboutUs)


// Car Booking
router.get('/getBooking', middleware, CarbookingController.getBooking)
router.get('/booking', CarbookingController.allBooking)
router.get("booking_data", CarbookingController.Booking_data);
router.post("/carBook",middleware, CarbookingController.CarBook);     
router.get("/mail", CarbookingController.mail_get);
router.get("/booking_dlt/:id", CarbookingController.Booking_dlt);
router.get("/Gmailupdateid/:id", CarbookingController.Gmail_updateid);
router.put("/booking/:id", CarbookingController.booking_update);
router.post("/driverSend", CarbookingController.driverSent);
router.get("/invoice", middleware, CarbookingController.receipt)
// router.post('/payment', CarbookingController.Payment)


// Contact Us
router.get('/getContactUs',middleware, ContactController.userContactUs) // user page
router.post("/contactUs", ContactController.contactUs);
router.get("/contactUs", ContactController.getContactUs);
router.get("/contactUs/:id", ContactController.contactUs_dlt);

// Feedback
router.get('/getFeedback', middleware, FeedbackController.getFeedback)
router.post("/feedback", middleware, FeedbackController.feed_back);
router.get("/allFeedback", middleware, FeedbackController.feedback_data);
router.get("/feedback_dlt/:id", middleware, FeedbackController.feedback_dlt);

// Add Car
router.get('/addCar', middleware, AddCarController.getAddCar)
router.post("/add_car", middleware, upload.single('image'), AddCarController.addCar);
router.get("/allCar", middleware, AddCarController.allCarData);
router.get("/carUpdate/:id", AddCarController.car_updateId);
router.put("/carUp/:id", AddCarController.carUpdate);
router.get("/carDelete/:id", AddCarController.car_dlt);

// State
router.post("/State", StateController.state_data);
router.get("/StateData", StateController.state_value);
router.delete("/stateDelete/:id", StateController.state_de);

// Driver
router.post("/driver", DriverController.addDriver);
router.get("/driverData", DriverController.getDriver);
router.put("/updateDriver", DriverController.updateDriver);
router.delete("/driver_delete/:id", DriverController.driver_dlt);

// Profile
// router.get("/allUser", ProfileController.getAllUser);
router.get("/allUser", ProfileController.allUserData);
router.get('/profile',middleware,ProfileController.getProfile)
router.post("/profile", middleware, ProfileController.addProfile);
router.post("/profiles", middleware, ProfileController.p_Update);
router.get("/profileupdate", ProfileController.Profile_updateid);
router.get("/allUsers", ProfileController.Profile_allUser);
router.get("/allUsers", ProfileController.Profile_allUser);
router.get("/userDelete/:id", ProfileController.user_dlt)

router.get('/logout',middleware, AuthController.logout)



module.exports = router;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const MongoStore = require('connect-mongo');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const ejsLayouts = require("express-ejs-layouts");
const path = require('path');

// Database Connection

const localhost = "mongodb://127.0.0.1:27017/CAR";
mongoose.connect( localhost, {useNewUrlParser: true},
  () => {
    console.log("DB connected ");
  }
);

app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'views'));


app.use(ejsLayouts);
// app.set('layout', './admin/layout/master_app')
app.set('layout', './frontend/layout/master_app')

// app.use(cors());
app.use(express.static(path.join(process.cwd(),'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Session Use
app.use(cookieParser());
app.use(session({
  store: MongoStore.create({ mongoUrl: localhost }),
  secret: 'jbufhdhdhkhblub',
  saveUninitialized: true,
  cookie: {
      /** millisecond * second * minute * hour * 7  = 1 week */
      maxAge: 1000 * 60 * 60 * 24 * 7
  },
  resave: false,
}));

// Router
const productRoutes = require("./routes/router");
app.use("/", productRoutes);


app.listen(8200, () => console.log("Hello world app listening on port!"));

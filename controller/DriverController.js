const { response } = require("express");
const Driver = require("../model/Driver");
var nodemailer = require("nodemailer");
const mongodb = require("mongodb");

// Add Driver
const addDriver = async (req, res) => {
    const { driver, phone, email, licence, alternativephone, state } = req.body;
 
    const user = new Driver({
            driver,
            phone,
            email,
            licence,
            state,
            alternativephone
        });
    user.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send({ message: "succes" });
            }
        });
};

// Get Driver
const getDriver = async (req, res) => {
    
   await Driver.find({}, function (err, Product) {
        if (err) {
            res.send({ message: "don't get data" });
        } else {
            res.send(Product);
        }
    });
};

// Update Driver Info
const updateDriver = async(req, res) => {

    const {driver,phone,email,licence,state,alternativephone} = req.body;
    await Driver.findByIdAndUpdate(
        {
            _id : req.body.id
        },
        {
            driver,
            phone,
            email,
            licence,
            state,
            alternativephone
        }
        )
        .then((data) => {
            res.json({
                data,
                message : "data Update"
            })
        })
        .catch((err) => res.json({
            err,
            message : "can't Update"
        }))
}

// Delete Driver
const driver_dlt = async (req, res) => {
    const data = await Driver.findByIdAndDelete({
        _id: new mongodb.ObjectId(req.params.id),
    });
    res.send(data);
};

module.exports = {
    addDriver,
    getDriver,
    updateDriver,
    driver_dlt
};

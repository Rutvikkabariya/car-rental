const { response } = require("express");
const State = require("../model/State");
var nodemailer = require("nodemailer");
const mongodb = require("mongodb");


const state_data = async (req, res) => {
    const { state } = req.body;

    const user = new State({ state });
    user.save((err) => {
       if (err) {
          res.send(err);
      } else {
          res.send({ message: "success" });
       }    
    });
};


const state_value = async (req, res) => {
    State.find({}, function (err, Product) {
        if (err) {
            res.send({ message: "don't get data" });
        } else {
            res.send(Product);
        }
    });
};

const state_de = async (req, res) => {
    const data = await State.deleteOne({
        _id: new mongodb.ObjectId(req.params.id),
    });
    res.send(data);
};

module.exports = {
    state_data,
    state_value,
    state_de
};

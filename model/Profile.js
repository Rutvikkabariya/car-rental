const mongoose = require("mongoose");

const Profile = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'user'
    },
    gender:{
        type : String
    },
    dob:{
        type:Number
    },
    Address:{
        type:String
    },
});

module.exports = mongoose.model("Profile", Profile);

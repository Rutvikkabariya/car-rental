const { response } = require("express");
const Profile = require("../model/Profile");
const mongodb = require("mongodb");
const UserSchema = require("../model/UserSchema")
const mongoose = require("mongoose")

// get all User
const getAllUser = async (req, res) => {
    res.render('admin/all_user',{layout:'./admin/layout/master_app'})
}

// All userData
const allUserData = async (req, res) => {
    UserSchema.find({}, function (err, data) {
      if (err) {
        res.json({ message: "don't get data" });
      } else {
        res.render('admin/all_user',{layout:'./admin/layout/master_app',data})
      }
    });
  };

//  get Profile page
const getProfile = async(req,res) =>{
    const user = await UserSchema.findById(req.session.user._id)
    if(req.session.user.role === 'admin'){

        res.render('admin/profile',{layout:'./admin/layout/master_app',user})
    }else{

        res.render('frontend/profile',{user})
    }
} 
  
// Profile data
const addProfile = async (req, res) => {
    const {user_id, gender, dob, address} = req.body;

    try{
        const user = new Profile({
            user_id,
            gender,
            dob,
            address
        });

        await user.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.json({ message: "success" });
            }
        });

    }catch(err){
        res.send(err)
    }
}

// Profile Update
const Profile_updateid = async (req, res) => {
    const data = await Profile.findOne({
        _id: new mongodb.ObjectId(req.params.id),
    });
    res.json({
        data
    });
};


const p_Update = async (req, res) => {
    const { name, email, phone, gender, address } = req.body;

    await UserSchema.findByIdAndUpdate(
        { _id: req.session.user._id },
        {
                name,
                phone,
                email,
                gender,
                address,
           
        }
    )
        .then((result) => {
            res.status(200).json({
                msg:"Update Successfully",
                User: result,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                msg:"Try Again...",
                error: err,
            });
        });
};

// Profile Data Get
const Profile_allUser = async (req, res) => {


 try{
    const data = await Profile.aggregate([
        // {
        //     $match:{
        //         user_id: new mongoose.Types.ObjectId(id)
        //     }
        // },
        {
            $lookup:{
                from:'users',
                localField:'user_id',
                foreignField:'_id',
                pipeline:[
                    {
                        $project:{
                            _id:0,
                        }
                    }
                ],
                as:'user_data'
            }
        },
        {
           $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$user_data", 0 ] }, "$$ROOT" ] } }
        },
        { $project: {user_id:0, user_data:0 } }
    ])

    res.status(200).json({
        success :"all users",
        data : data

    })

  } catch(err){
    res.send(err)
  }

    // Profile.find({}, function (err, Product) {
    //     if (err) {
    //         res.send({ message: "don't get data" });
    //     } else {
    //         res.send(Product);
    //     }
    // });
    return
};

// user Delete
const user_dlt = async (req, res) => {
    const data = await UserSchema.findByIdAndDelete({
      _id: req.params.id
    });
    res.redirect('/allUser')
  };



module.exports = {
    getAllUser,
    allUserData,
    getProfile,
    addProfile,
    p_Update,
    Profile_updateid,
    Profile_allUser,
    user_dlt
};

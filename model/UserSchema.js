const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type:String,
    require:true
  },
  role:{
    type:String,
    require:true
  },
  phone:{
    type:Number,
    require:true,
    default:9798767678
  },
  email:{
    type:String,
    require:true
  },
  gender:{
      type : String,
      default:'male'
  },
  dob:{
      type:Number,
      default:'2001-01-01'
  },
  address:{
      type:String,
      default:'a-212,yogichowk, surat'
  },
  password:{
    type:String,
    require:true
  },
  otp: {
    type:String
  },
});


// password hashing............
UserSchema.pre('save', async function(next){

  if(this.isModified("password")){
      this.password = await bcrypt.hash(this.password,10)
  }
  next();
})

module.exports = mongoose.model("user", UserSchema);

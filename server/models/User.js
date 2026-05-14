const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

 profilePic:{
  type:String,
  default:""
 },

 firstName: String,

 lastName:String,

 email: String,

 age: Number,

 /*
 NEW
 */
 gender:{
  type:String,
  enum:["Male","Female","Other"],
  default:"Other"
 },

 mobile: {
  type: Number,
  required: true
 },

 location: String,

 aadhaar: String,

 password: {
  type: String,
  required: true
 },

 skills: [String],

 description:{
 type:String,
 default:""
},

 role: {
  type: String,
  default: "worker"
 },

 otp:{
 type:String
},

otpExpiry:{
 type:Date
}

});

module.exports = mongoose.model(
 "User",
 userSchema
);
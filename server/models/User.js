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
},

ratings:[
 {
  userId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
  },

  requestId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"JobRequest"
  },

  stars:{
   type:Number,
   min:1,
   max:5
  }
 }
],

averageRating:{
 type:Number,
 default:0
},

totalRatings:{
 type:Number,
 default:0
}

});

module.exports = mongoose.model(
 "User",
 userSchema
);
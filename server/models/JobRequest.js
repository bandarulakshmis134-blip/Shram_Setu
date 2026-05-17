const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema({

 jobId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Job",
  default:null
 },

 userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 workerId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 description:{
  type:String,
  required:true
 },

 location:{
  type:String,
  required:true
 },

 budget:{
  type:Number,
  required:true
 },

 urgency:{
  type:String,
  enum:["Flexible","24 Hours","Urgent"],
  default:"Flexible"
 },

 status:{
  type:String,
  enum:[
   "pending",
   "accepted",
   "rejected",
   "in-progress",
   "completed"
  ],
  default:"pending"
 },

 workOTP:{
  type:String,
  default:null
 },

 workOTPExpiry:{
  type:Date,
  default:null
 },

 /*
 AUTO DELETE FIELD
 */
 expiresAt:{
  type:Date,
  required:true
 }

},
{
 timestamps:true
});

/*
TTL INDEX
*/
jobRequestSchema.index(
 { expiresAt:1 },
 { expireAfterSeconds:0 }
);

module.exports = mongoose.model(
 "JobRequest",
 jobRequestSchema
);
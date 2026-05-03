const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({

 title:{
  type:String,
  required:true
 },

 category:{
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
  enum:["flexible","24hrs","urgent"],
  default:"flexible"
 },

 description:{
  type:String,
  required:true
 },

 expiryDate:{
  type:Date,
  required:true
 }

},{
 timestamps:true
});


/*
AUTO DELETE AFTER expiryDate
*/
jobSchema.index(
 { expiryDate:1 },
 { expireAfterSeconds:0 }
);


module.exports = mongoose.model("Job", jobSchema);
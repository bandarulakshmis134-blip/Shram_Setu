const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(

 {

  requestId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"JobRequest",
   required:true,
   unique:true
  },

  workerId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
  },

  userId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
  },

  service:{
   type:String,
   required:true
  },

  amount:{
   type:Number,
   required:true
  }

 },

 {
  timestamps:true
 }

);

module.exports = mongoose.model(
 "Invoice",
 invoiceSchema
);
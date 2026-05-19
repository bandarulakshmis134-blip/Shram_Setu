const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },

  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  /*
  REAL WORK REQUEST LINK
  */
  requestId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"JobRequest"
  },

  title: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "Schedule",
  scheduleSchema
);
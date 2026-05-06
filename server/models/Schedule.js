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
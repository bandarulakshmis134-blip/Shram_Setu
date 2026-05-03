const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({

  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
 },

  registrationType: {
    type: String,
    enum: ["individual", "group"], // allowed values
    required: true
  },

  // individual worker
  firstName: {
    type: String
  },

  // group worker
  groupName: {
    type: String
  },

  mobile: {
    type: Number,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  experience: {
    type: Number,
    required: true
  },

  skills: {
    type: [String],
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  priceType: {
    type: String,
    required: true
  },

  // only for individual worker
  age: Number,

  gender: String,

  aadhaar: Number,


  // only for group registration
  members: [

    {

      name: String,

      age: Number,

      gender: String,

      aadhaar: Number,

      skill: String

    }

  ]

},

{
  timestamps: true
}

);

module.exports = mongoose.model("Worker", workerSchema);
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

  role: {
    type: String,
    default: "worker"
  }

});

module.exports = mongoose.model("User", userSchema);
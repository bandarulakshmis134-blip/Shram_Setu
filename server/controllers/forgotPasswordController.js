const User =
 require("../models/User");

const bcrypt =
 require("bcryptjs");

const sendEmail =
 require("../utils/sendEmail");

/*
========================
SEND OTP
========================
*/
exports.sendOTP =
 async (req,res)=>{

 try{

  const { email } =
   req.body;

  /*
  FIND USER
  */
  const user =
   await User.findOne({
    email
   });

  if(!user){

   return res.status(404).json({

    message:"User not found"

   });

  }

  /*
  GENERATE OTP
  */
  const otp = Math.floor(

   100000 +
   Math.random() * 900000

  ).toString();

  /*
  SAVE OTP
  */
  user.otp = otp;

  user.otpExpiry =

   Date.now() +

   2 * 60 * 1000;

  await user.save();

  /*
  SEND EMAIL
  */
  await sendEmail(

   email,

   "Shram Setu Password Reset OTP",

   `Your OTP is ${otp}`

  );

  res.json({

   message:"OTP sent"

  });

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:"Failed"

  });

 }

};

/*
========================
VERIFY OTP
========================
*/
exports.verifyOTP =
 async (req,res)=>{

 try{

  const {
   email,
   otp
  } = req.body;

  const user =
   await User.findOne({
    email
   });

  if(

   !user ||

   user.otp !== otp ||

   user.otpExpiry < Date.now()

  ){

   return res.status(400).json({

    message:"Invalid OTP"

   });

  }

  res.json({

   message:"OTP verified"

  });

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:"Failed"

  });

 }

};

/*
========================
RESET PASSWORD
========================
*/
exports.resetPassword =
 async (req,res)=>{

 try{

  const {
   email,
   password
  } = req.body;

  const user =
   await User.findOne({
    email
   });

  if(!user){

   return res.status(404).json({

    message:"User not found"

   });

  }

  /*
  HASH PASSWORD
  */
  const hashedPassword =

   await bcrypt.hash(
    password,
    10
   );

  user.password =
   hashedPassword;

  /*
  CLEAR OTP
  */
  user.otp = null;

  user.otpExpiry = null;

  await user.save();

  res.json({

   message:
    "Password reset successful"

  });

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:"Failed"

  });

 }

};
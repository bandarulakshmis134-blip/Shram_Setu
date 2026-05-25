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

   `

   <div style="
    background:#f3f6fb;
    padding:40px 20px;
    font-family:Arial,sans-serif;
   ">

    <div style="
     max-width:600px;
     margin:auto;
     background:white;
     border-radius:20px;
     overflow:hidden;
     box-shadow:0 10px 30px rgba(0,0,0,0.08);
    ">

  <!-- TOP HEADER -->
<div style="
 background:#2563eb;
 padding:35px;
 text-align:center;
">

 <!-- LOGO BOX -->
 <div style="
  width:90px;
  height:90px;
  background:white;
  margin:0 auto 20px auto;
  border-radius:20px;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 8px 20px rgba(0,0,0,0.15);
 ">

  <img
   src="cid:logo"
   alt="Shram Setu Logo"
   style="
    width:65px;
    height:65px;
    object-fit:contain;
   "
  />

 </div>

 <h1 style="
  color:white;
  margin:0;
  font-size:38px;
  font-weight:bold;
  letter-spacing:1px;
 ">

  Shram <span style="color:#bfdbfe;">Setu</span>

 </h1>

 <p style="
  color:#dbeafe;
  margin-top:10px;
  font-size:15px;
 ">

  Connecting Skills to Opportunities

 </p>

</div>

     <!-- CONTENT -->
     <div style="
      padding:40px 35px;
      color:#1f2937;
     ">

      <h2 style="
       margin-top:0;
       font-size:24px;
       color:#111827;
      ">

       Password Reset Verification

      </h2>

      <p style="
       font-size:15px;
       line-height:1.8;
       color:#4b5563;
      ">

       Hello ${user.firstName || "User"},
       <br/><br/>

       We received a request to reset your Shram Setu account password.

       Please use the OTP below to continue securely.

      </p>

      <!-- OTP BOX -->
      <div style="
       margin:35px 0;
       text-align:center;
      ">

       <div style="
        display:inline-block;
        background:#eff6ff;
        color:#2563eb;
        font-size:36px;
        font-weight:bold;
        letter-spacing:10px;
        padding:18px 35px;
        border-radius:16px;
        border:2px dashed #93c5fd;
       ">

        ${otp}

       </div>

      </div>

      <!-- SECURITY -->
      <div style="
       background:#f9fafb;
       border-radius:14px;
       padding:20px;
       margin-top:20px;
      ">

       <p style="
        margin:0;
        color:#374151;
        font-size:14px;
        line-height:1.8;
       ">

        ⚠️ <strong>Security Tips</strong><br/><br/>

        • Never share this OTP with anyone.<br/>
        • Shram Setu employees will never ask for your OTP.<br/>
        • This OTP will expire in <strong>2 minutes</strong>.<br/>
        • If you did not request this reset, you can safely ignore this email.

       </p>

      </div>

      <!-- FOOTER -->
      <p style="
       margin-top:35px;
       font-size:14px;
       color:#6b7280;
       line-height:1.8;
      ">

       Thank you for choosing
       <strong>Shram Setu</strong> 🚀

      </p>

     </div>

    </div>

   </div>

   `

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
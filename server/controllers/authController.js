const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/*
=========================
GENERATE TOKENS
=========================
*/

const generateAccessToken = (user) => {

 return jwt.sign(

  { id: user._id },

  process.env.JWT_SECRET,

  { expiresIn: "15m" }

 );

};


const generateRefreshToken = (user) => {

 return jwt.sign(

  { id: user._id },

  process.env.JWT_REFRESH_SECRET,

  { expiresIn: "7d" }

 );

};



/*
=========================
SIGNUP
=========================
*/

exports.signup = async (req,res)=>{

 try{

  const {

   profilePic,
   firstName,
   lastName,
   email,
   gender,
   age,
   aadhaar,
   location,
   mobile,
   password,
   skills

  } = req.body;


  // check existing user
  const existingUser = await User.findOne({ mobile });

  if(existingUser){

   return res.status(400).json({

    message:"User already exists"

   });

  }


  // hash password
  const hashedPassword = await bcrypt.hash(

   password,

   10

  );


  // create user
  const newUser = new User({

   profilePic,

   firstName,

   lastName,

   email,

   gender,

   age:Number(age),

   aadhaar:Number(aadhaar),

   location,

   mobile:Number(mobile),

   password:hashedPassword,

   skills: skills || []

  });


  await newUser.save();


  res.status(201).json({

   message:"Signup successful"

  });

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:error.message

  });

 }

};



/*
=========================
LOGIN (using MOBILE)
=========================
*/


exports.login = async (req,res)=>{

 try{

  const mobile = Number(req.body.mobile);
  const password = req.body.password;

  console.log("LOGIN DATA:", mobile, password);


  const user = await User.findOne({ mobile });

  console.log("FOUND USER:", user);


  if(!user){

   return res.status(400).json({
    message:"User not found"
   });

  }


  const isMatch = await bcrypt.compare(
   password,
   user.password
  );


  if(!isMatch){

   return res.status(400).json({
    message:"Wrong password"
   });

  }


  const accessToken = jwt.sign(

   { id:user._id },

   process.env.JWT_SECRET,

   { expiresIn:"15m" }

  );


  const refreshToken = jwt.sign(

   { id:user._id },

   process.env.JWT_REFRESH_SECRET,

   { expiresIn:"7d" }

  );


  res.cookie(

   "refreshToken",

   refreshToken,

   {

    httpOnly:true,
    secure:false,
    sameSite:"strict"

   }

  );


  res.json({

   accessToken,
   user

  });

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:error.message

  });

 }

};


/*
=========================
REFRESH TOKEN
=========================
*/

exports.refreshToken = (req,res)=>{

 const token = req.cookies.refreshToken;


 if(!token){

  return res.status(401).json({

   message:"No refresh token"

  });

 }


 jwt.verify(

  token,

  process.env.JWT_REFRESH_SECRET,

  (err,decoded)=>{

   if(err){

    return res.status(403).json({

     message:"Invalid refresh token"

    });

   }


   const newAccessToken = jwt.sign(

    { id: decoded.id },

    process.env.JWT_SECRET,

    { expiresIn:"15m" }

   );


   res.json({

    accessToken:newAccessToken

   });

  }

 );

};



/*
=========================
LOGOUT
=========================
*/

exports.logout = (req,res)=>{

 res.clearCookie("refreshToken");


 res.json({

  message:"Logged out"

 });

};
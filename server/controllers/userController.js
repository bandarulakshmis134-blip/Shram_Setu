const User = require("../models/User");

exports.updateUser = async (req,res)=>{

 try{

  const {
   firstName,
   email,
   age,
   mobile,
   location,
   profilePic,
   skills
  } = req.body;

  const updatedUser = await User.findByIdAndUpdate(

   req.params.id,

   {
    firstName,
    email,
    age,
    mobile,
    location,
    profilePic,
    skills
   },

   {
    returnDocument:"after",
    runValidators:true
   }

  );

  if(!updatedUser){
   return res.status(404).json({ message:"User not found" });
  }

  res.json(updatedUser);

 }

 catch(error){

  console.log("UPDATE ERROR:", error);

  res.status(500).json({
   message:error.message
  });

 }

};
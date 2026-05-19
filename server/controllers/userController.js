const User = require("../models/User");

exports.updateUser = async (
 req,
 res
)=>{

 try{

  const {
   firstName,
   email,
   gender,
   age,
   mobile,
   location,
   profilePic,
   skills,
   description
  } = req.body;

  /*
  CHECK USER
  */
  const existingUser =
   await User.findById(
    req.params.id
   );

  if(!existingUser){

   return res.status(404).json({

    message:"User not found"

   });

  }

  /*
  CHECK DUPLICATE EMAIL
  */
  if(

   email &&
   email !== existingUser.email

  ){

   const emailExists =
    await User.findOne({

     email

    });

   if(emailExists){

    return res.status(400).json({

     message:
      "Email already exists"

    });

   }

  }

  /*
  UPDATE USER
  */
  const updatedUser =
   await User.findByIdAndUpdate(

    req.params.id,

    {
     firstName,
     email,
     gender,
     age,
     mobile,
     location,
     profilePic,
     description,

     skills:
      (skills || []).filter(

       (skill)=>

        typeof skill ===
        "string" &&

        skill.trim() !== ""

      )

    },

    {
     returnDocument:"after",
     runValidators:true
    }

   );

  res.json(updatedUser);

 }

 catch(error){

  console.log(
   "UPDATE ERROR:",
   error
  );

  res.status(500).json({

   message:error.message

  });

 }

};
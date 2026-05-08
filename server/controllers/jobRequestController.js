const JobRequest = require("../models/JobRequest");

exports.createRequest = async(req,res)=>{

 try{

  const {

   userId,
   workerId,
   description,
   location,
   budget,
   urgency

  } = req.body;


  /*
 SET EXPIRY TIME
 */

 let expiryTime = new Date();

 if(urgency === "Flexible"){

  expiryTime.setDate(expiryTime.getDate() + 3); // 3 days

 }

 else if(urgency === "24 Hours"){

  expiryTime.setHours(expiryTime.getHours() + 24);

 }

 else if(urgency === "Urgent"){

  expiryTime.setHours(expiryTime.getHours() + 6);

 }


 const newRequest = new JobRequest({

  userId,
  workerId,
  description,
  location,
  budget,
  urgency,
  expiresAt:expiryTime

 });


 await newRequest.save();


 res.status(201).json({

  message:"Request created",
  request:newRequest

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
========================
GET WORKER REQUESTS
========================
*/
exports.getWorkerRequests = async (
  req,
  res
) => {

  try {

    const requests =
      await JobRequest.find({

        workerId: req.user.id,

        expiresAt: {
          $gt: new Date()
        }

      })

      .populate(
        "userId",
        "firstName"
      )

      .sort({ createdAt: -1 });

    res.json(requests);

  }

  catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

};
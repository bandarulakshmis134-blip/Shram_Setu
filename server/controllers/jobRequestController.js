const JobRequest = require("../models/JobRequest");

const Invoice = require("../models/Invoice");

const Schedule = require("../models/Schedule");

const sendEmail = require("../utils/sendEmail");

const User = require("../models/User");

const Notification = require("../models/Notification");
/*
========================
CREATE REQUEST
========================
*/
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

  expiryTime.setDate(
   expiryTime.getDate() + 3
  );

 }

 else if(urgency === "24 Hours"){

  expiryTime.setHours(
   expiryTime.getHours() + 24
  );

 }

 else if(urgency === "Urgent"){

  expiryTime.setHours(
   expiryTime.getHours() + 6
  );

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

 /*
========================
CREATE NOTIFICATION
========================
*/
await Notification.create({

 userId:workerId,

 message:
  "You received a new work request",

 type:"request",

 link:"/dashboard"

});

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

  /*
  GET ONLY PENDING REQUESTS
  */
  const allRequests =
   await JobRequest.find({

    workerId:req.user.id,

    /*
    SHOW ONLY PENDING
    */
    status:"pending"

   })

   .populate(
    "userId",
    "firstName"
   )

   .sort({
    createdAt:-1
   });

  /*
  REMOVE EXPIRED REQUESTS
  */
  const validRequests = [];

  for(const request of allRequests){

   /*
   STILL VALID
   */
   if(
    request.expiresAt > new Date()
   ){

    validRequests.push(request);

   }

   /*
   EXPIRED -> DELETE
   */
   else{

    await JobRequest.findByIdAndDelete(
     request._id
    );

   }

  }

  res.json(validRequests);

 }

 catch (error) {

  console.log(error);

  res.status(500).json({
   message:error.message
  });

 }

};

/*
========================
GET USER REQUESTS
========================
*/
exports.getUserRequests = async (
 req,
 res
) => {

 try {

  const requests =
   await JobRequest.find({

    userId:req.user.id

   })

   .populate(
    "workerId",
    "firstName skills"
   )

   .sort({
    createdAt:-1
   });

  res.json(requests);

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
GET WORKER HISTORY
========================
*/
/*
========================
GET WORKER HISTORY
========================
*/
/*
========================
GET WORKER HISTORY
========================
*/
exports.getWorkerHistory = async (
 req,
 res
) => {

 try {

  const requests =
   await JobRequest.find({

    workerId:req.user.id,

    $or:[

      {
       status:"accepted"
      },

      {
       status:"in-progress"
      }

    ]

   })

   .populate(
    "userId",
    "firstName"
   )

   .sort({
    createdAt:-1
   });

  res.json(requests);

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
GET WORKER COMPLETED
========================
*/
exports.getWorkerCompleted = async (
 req,
 res
) => {

 try {

  const requests =
   await JobRequest.find({

    workerId:req.user.id,

    status:"completed"

   })

   .populate(
    "userId",
    "firstName"
   )

   .sort({
    createdAt:-1
   });

  res.json(requests);

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
UPDATE REQUEST STATUS
========================
*/
exports.updateRequestStatus = async (
 req,
 res
) => {

 try{

  const updatedRequest =
   await JobRequest.findByIdAndUpdate(

    req.params.id,

    {
     status:req.body.status
    },

    {
     returnDocument:"after"
    }

   );

   /*
AUTO DELETE INVOICE
WHEN WORK COMPLETES
*/
if(req.body.status === "completed"){

 await Invoice.findOneAndDelete({

  requestId:req.params.id

 });

 /*
 REMOVE COMPLETED SCHEDULE
 */
 await Schedule.findOneAndDelete({

  requestId:req.params.id

 });

}

  if(!updatedRequest){

   return res.status(404).json({

    message:"Request not found"

   });

  }

  res.json(updatedRequest);

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
DELETE REQUEST
========================
*/
exports.deleteRequest = async (
 req,
 res
) => {

 try {

  const deletedRequest =
   await JobRequest.findByIdAndDelete(
    req.params.id
   );

  /*
  ALREADY DELETED
  */
  if(!deletedRequest){

   return res.status(200).json({

    message:"Request already removed"

   });

  }

  res.json({

   message:"Request deleted successfully"

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
SEND WORK OTP
========================
*/
exports.sendWorkOTP = async (
 req,
 res
)=>{

 try{

  const request =
   await JobRequest.findById(
    req.params.id
   )

   .populate(
    "userId"
   );

  if(!request){

   return res.status(404).json({

    message:"Request not found"

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
  request.workOTP = otp;

  request.workOTPExpiry =

   Date.now() +

   2 * 60 * 1000;

  await request.save();

  /*
  SEND EMAIL
  */
  await sendEmail(

   request.userId.email,

   "Shram Setu Work Completion OTP",

   `Your work completion OTP is ${otp}`

  );

  res.json({

   message:"OTP sent to customer"

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
VERIFY WORK OTP
========================
*/
exports.verifyWorkOTP = async (
 req,
 res
)=>{

 try{

  const {
   otp
  } = req.body;

  const request =
   await JobRequest.findById(
    req.params.id
   );

  if(!request){

   return res.status(404).json({

    message:"Request not found"

   });

  }

  /*
  INVALID OTP
  */
  if(

   request.workOTP !== otp ||

   request.workOTPExpiry < Date.now()

  ){

   return res.status(400).json({

    message:"Invalid or expired OTP"

   });

  }

  /*
  COMPLETE WORK
  */
  request.status =
   "completed";

  request.workOTP =
   null;

  request.workOTPExpiry =
   null;

  await request.save();

  /*
  DELETE INVOICE
  */
  await Invoice.findOneAndDelete({

   requestId:
    request._id

  });

  /*
  REMOVE COMPLETED SCHEDULE
  */
  await Schedule.findOneAndDelete({

   requestId:
    request._id

  });

  res.json({

   message:
    "Work completed successfully"

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
RATE WORKER
========================
*/
exports.rateWorker = async (
 req,
 res
)=>{

 try{

  const {
   stars
  } = req.body;

  const request =
   await JobRequest.findById(
    req.params.id
   );

  if(!request){

   return res.status(404).json({

    message:"Request not found"

   });

  }

  /*
  ONLY COMPLETED WORK
  */
  if(request.status !== "completed"){

   return res.status(400).json({

    message:
     "Work not completed yet"

   });

  }

  /*
  ONLY REQUEST OWNER
  CAN RATE
  */
  if(
   request.userId.toString()
   !== req.user.id
  ){

   return res.status(403).json({

    message:
     "Unauthorized"

   });

  }

  const worker =
   await User.findById(
    request.workerId
   );

  if(!worker){

   return res.status(404).json({

    message:"Worker not found"

   });

  }

  /*
  PREVENT DUPLICATE RATING
  */
  const alreadyRated =
   worker.ratings?.find(

    (rating)=>

     rating.requestId.toString()
     === request._id.toString()

   );

  if(alreadyRated){

   return res.status(400).json({

    message:
     "You already rated this work"

   });

  }

  /*
  ADD RATING
  */
  worker.ratings.push({

   userId:req.user.id,

   requestId:
    request._id,

   stars

  });

  /*
  CALCULATE AVERAGE
  */
  const total =
   worker.ratings.reduce(

    (sum,rating)=>

     sum + rating.stars,

    0

   );

  worker.totalRatings =
   worker.ratings.length;

  worker.averageRating =

   total /

   worker.totalRatings;

  await worker.save();

  res.json({

   message:
    "Rating submitted successfully"

  });

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:error.message

  });

 }

};
const JobRequest = require("../models/JobRequest");
const Invoice = require("../models/Invoice");


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
     new:true
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


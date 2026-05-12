const Invoice = require("../models/Invoice");
const JobRequest = require("../models/JobRequest");

/*
========================
CREATE INVOICE
========================
*/
exports.createInvoice = async (
 req,
 res
)=>{

 try{

  const {
   requestId,
   amount
  } = req.body;

  /*
  CHECK EXISTING
  */
  const existing =
   await Invoice.findOne({
    requestId
   });

  if(existing){

   return res.json(existing);

  }

  /*
  GET REQUEST
  */
  const request =
   await JobRequest.findById(requestId)

   .populate("workerId")
   .populate("userId");

  if(!request){

   return res.status(404).json({

    message:"Request not found"

   });

  }

  /*
  CREATE FROM REQUEST
  */
  const invoice =
   await Invoice.create({

    requestId,

    workerId:
     request.workerId._id,

    userId:
     request.userId._id,

    service:
     request.workerId.skills?.[0]
     || "Service",

    amount

   });

  const populatedInvoice =
   await Invoice.findById(invoice._id)

   .populate(
    "workerId",
    "firstName location"
   )

   .populate(
    "userId",
    "firstName location"
   );

  res.status(201).json(
   populatedInvoice
  );

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
GET USER INVOICES
========================
*/
exports.getUserInvoices = async (
 req,
 res
)=>{

 try{

  const invoices =
   await Invoice.find({

    userId:req.user.id

   })

   .populate(
    "workerId",
    "firstName location"
   )

   .sort({
    createdAt:-1
   });

  res.json(invoices);

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
GET WORKER INVOICES
========================
*/
exports.getWorkerInvoices = async (
 req,
 res
)=>{

 try{

  const invoices =
   await Invoice.find({

    workerId:req.user.id

   })

   .populate(
    "userId",
    "firstName location"
   )

   .sort({
    createdAt:-1
   });

  res.json(invoices);

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:error.message

  });

 }

};
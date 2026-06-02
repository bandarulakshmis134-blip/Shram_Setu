const JobRequest =
 require("../models/JobRequest");

const Invoice =
 require("../models/Invoice");

const Schedule =
 require("../models/Schedule");

const User =
 require("../models/User");

const sendEmail =
 require("../utils/sendEmail");

/*
========================
CREATE REQUEST
========================
*/
exports.createRequest =
 async (req,res)=>{

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
  ========================
  VALIDATION
  ========================
  */
  if(

   !userId ||
   !workerId ||
   !description ||
   !location ||
   !budget

  ){

   return res.status(400).json({

    message:
     "All fields are required"

   });

  }

  if(Number(budget) <= 0){

   return res.status(400).json({

    message:
     "Invalid budget"

   });

  }

  /*
  ========================
  SET EXPIRY TIME
  ========================
  */
  const expiryTime =
   new Date();

  if(
   urgency === "Flexible"
  ){

   expiryTime.setDate(

    expiryTime.getDate() + 3

   );

  }

  else if(
   urgency === "24 Hours"
  ){

   expiryTime.setHours(

    expiryTime.getHours() + 24

   );

  }

  else if(
   urgency === "Urgent"
  ){

   expiryTime.setHours(

    expiryTime.getHours() + 6

   );

  }

  /*
  ========================
  CREATE REQUEST
  ========================
  */
  const newRequest =
   new JobRequest({

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

   message:
    "Request created successfully",

   request:newRequest

  });

 }

 catch(error){

  console.log(
   "CREATE REQUEST ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to create request"

  });

 }

};

/*
========================
GET WORKER REQUESTS
========================
*/
exports.getWorkerRequests =
 async (req,res)=>{

 try{

  const allRequests =
   await JobRequest.find({

    workerId:req.user.id,

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
  REMOVE EXPIRED
  */
  const validRequests = [];

  for(
   const request of allRequests
  ){

   if(

    request.expiresAt >
    new Date()

   ){

    validRequests.push(
     request
    );

   }

   else{

    await JobRequest.findByIdAndDelete(

     request._id

    );

   }

  }

  res.json(validRequests);

 }

 catch(error){

  console.log(
   "GET WORKER REQUESTS ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message

  });

 }

};

/*
========================
GET USER REQUESTS
========================
*/
exports.getUserRequests =
 async (req,res)=>{

 try{

  const requests =
   await JobRequest.find({

    userId:req.user.id

   })

   .populate(

    "workerId",

    "firstName skills averageRating totalRatings"

   )

   .sort({

    createdAt:-1

   });

  /*
  ENSURE RATING STATUS
  */
  const updatedRequests =
   requests.map((request)=>{

    const requestObj =
     request.toObject();

    return{

     ...requestObj,

     isRated:

      Boolean(
       requestObj.ratedAt
      ) ||

      requestObj.isRated ||

      false

    };

   });

  res.status(200).json(
   updatedRequests
  );

 }

 catch(error){

  console.log(
   "GET USER REQUESTS ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to fetch requests"

  });

 }

};

/*
========================
GET WORKER HISTORY
========================
*/
exports.getWorkerHistory =
 async (req,res)=>{

 try{

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

  console.log(
   "GET WORKER HISTORY ERROR:",
   error
  );

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
exports.getWorkerCompleted =
 async (req,res)=>{

 try{

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

  /*
  ENSURE RATING STATUS
  */
  const updatedRequests =
   requests.map((request)=>{

    const requestObj =
     request.toObject();

    return{

     ...requestObj,

     isRated:

      Boolean(
       requestObj.ratedAt
      ) ||

      requestObj.isRated ||

      false

    };

   });

  res.status(200).json(
   updatedRequests
  );

 }

 catch(error){

  console.log(
   "GET WORKER COMPLETED ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to fetch completed requests"

  });

 }

};

/*
========================
UPDATE REQUEST STATUS
========================
*/
exports.updateRequestStatus =
 async (req,res)=>{

 try{

  const request =
   await JobRequest.findById(
    req.params.id
   );

  /*
  NOT FOUND
  */
  if(!request){

   return res.status(404).json({

    message:"Request not found"

   });

  }

  /*
  UPDATE STATUS
  */
  request.status =
   req.body.status;

  await request.save();

  /*
  CLEANUP AFTER COMPLETION
  */
  if(

   req.body.status ===
   "completed"

  ){

   await Invoice.findOneAndDelete({

    requestId:req.params.id

   });

   await Schedule.findOneAndDelete({

    requestId:req.params.id

   });

  }

  res.json(request);

 }

 catch(error){

  console.log(
   "UPDATE REQUEST STATUS ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to update request"

  });

 }

};

/*
========================
DELETE REQUEST
========================
*/
exports.deleteRequest =
 async (req,res)=>{

 try{

  const deletedRequest =
   await JobRequest.findByIdAndDelete(

    req.params.id

   );

  if(!deletedRequest){

   return res.status(200).json({

    message:
     "Request already removed"

   });

  }

  res.json({

   message:
    "Request deleted successfully"

  });

 }

 catch(error){

  console.log(
   "DELETE REQUEST ERROR:",
   error
  );

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
exports.sendWorkOTP = async (req,res)=>{

 try{

  const request =
   await JobRequest.findById(
    req.params.id
   )
   .populate(
    "userId",
    "firstName email"
   );

  if(!request){

   return res.status(404).json({

    message:"Request not found"

   });

  }

  if(
   request.status ===
   "completed"
  ){

   return res.status(400).json({

    message:"Work already completed"

   });

  }

  request.workOTP = null;
  request.workOTPExpiry = null;

  const otp = Math.floor(

   100000 +
   Math.random() * 900000

  ).toString();

  request.workOTP = otp;

  request.workOTPExpiry =
   new Date(

    Date.now() +
    5 * 60 * 1000

   );

  await request.save();

  const sanskritLines = [

   {

    line:
     "परिश्रमात् अधिकं किमपि पवित्रं नास्ति।",

    meaning:
     "Nothing is more sacred than hard work."

   },

   {

    line:
     "श्रमिकाः एव एतत् जगत् पुरतः नयन्ति।",

    meaning:
     "Workers are the ones who move this world forward."

   },

   {

    line:
     "श्रमजातः स्वेदः पवित्रः।",

    meaning:
     "The sweat born from labor is sacred."

   },

   {

    line:
     "श्रमेव जयते।",

    meaning:
     "Through hard work comes victory."

   }

  ];

  const randomQuote =
   sanskritLines[
    Math.floor(
     Math.random() *
     sanskritLines.length
    )
   ];

 const html = `

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
     src="https://shram-setu-nine.vercel.app/logo.png"
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

    Work Completion Verification

   </h2>

   <p style="
    font-size:15px;
    line-height:1.8;
    color:#4b5563;
   ">

    Your worker has requested work completion verification.

    <br/><br/>

    Please share the OTP below only after the work has been completed successfully.

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

   <!-- SANSKRIT QUOTE -->
   <div style="
    margin-top:20px;
    padding:20px;
    background:#f8fafc;
    border-radius:14px;
    text-align:center;
   ">

    <p style="
     font-size:20px;
     font-weight:bold;
     color:#1e3a8a;
     margin:0;
    ">

     ${randomQuote.line}

    </p>

    <p style="
     font-size:14px;
     color:#6b7280;
     font-style:italic;
     margin-top:10px;
    ">

     ${randomQuote.meaning}

    </p>

   </div>

   <!-- SECURITY -->
   <div style="
    background:#f9fafb;
    border-radius:14px;
    padding:20px;
    margin-top:25px;
   ">

    <p style="
     margin:0;
     color:#374151;
     font-size:14px;
     line-height:1.8;
    ">

     ⚠️ <strong>Security Tips</strong><br/><br/>

     • Never share this OTP before work completion.<br/>
     • OTP expires in <strong>5 minutes</strong>.<br/>
     • Verify only after confirming the work is completed.<br/>
     • If you did not request this verification, ignore this email.

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

`;

  await sendEmail(

   request.userId.email,

   "Shram Setu Work Completion OTP",

   html

  );

  res.json({

   message:"OTP sent successfully",

   expiresIn:300

  });

 }

 catch(error){

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
exports.verifyWorkOTP =
 async (req,res)=>{

 try{

  const { otp } =
   req.body;

  /*
  ========================
  GET REQUEST + OTP FIELDS
  ========================
  */
  const request =
   await JobRequest.findById(
    req.params.id
   ).select(

    "+workOTP +workOTPExpiry"

   );

  /*
  ========================
  REQUEST NOT FOUND
  ========================
  */
  if(!request){

   return res.status(404).json({

    message:
     "Request not found"

   });

  }

  /*
  ========================
  ALREADY COMPLETED
  ========================
  */
  if(

   request.status ===
   "completed"

  ){

   return res.status(400).json({

    message:
     "Work already completed"

   });

  }

  /*
  ========================
  OTP EXPIRED
  ========================
  */
  const isExpired =

   !request.workOTPExpiry ||

   new Date() >

   new Date(
    request.workOTPExpiry
   );

  /*
  ========================
  INVALID OTP
  ========================
  */
  if(

   request.workOTP !== otp ||

   isExpired

  ){

   return res.status(400).json({

    message:
     "Invalid or expired OTP"

   });

  }

  /*
  ========================
  COMPLETE WORK
  ========================
  */
  request.status =
   "completed";

  /*
  CLEAR OTP
  */
  request.workOTP =
   null;

  request.workOTPExpiry =
   null;

  await request.save();

  /*
  ========================
  DELETE INVOICE
  ========================
  */
  await Invoice.findOneAndDelete({

   requestId:
    request._id

  });

  /*
  ========================
  DELETE SCHEDULE
  ========================
  */
  await Schedule.findOneAndDelete({

   requestId:
    request._id

  });

  /*
  ========================
  SUCCESS RESPONSE
  ========================
  */
  res.json({

   message:
    "Work completed successfully"

  });

 }

 catch(error){

  console.log(
   "VERIFY OTP ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to verify OTP"

  });

 }

};

/*
========================
RATE WORKER
========================
*/
exports.rateWorker =
 async (req,res)=>{

 try{

  const { stars } =
   req.body;

  if(

   !stars ||

   stars < 1 ||

   stars > 5

  ){

   return res.status(400).json({

    message:
     "Rating must be between 1 and 5"

   });

  }

  const request =
   await JobRequest.findById(

    req.params.id

   );

  if(!request){

   return res.status(404).json({

    message:
     "Request not found"

   });

  }

  if(

   request.userId.toString() !==
   req.user.id

  ){

   return res.status(403).json({

    message:
     "Unauthorized"

   });

  }

  if(

   request.status !==
   "completed"

  ){

   return res.status(400).json({

    message:
     "Only completed requests can be rated"

   });

  }

  if(request.isRated){

   return res.status(400).json({

    message:
     "You have already rated this worker"

   });

  }

  const workerId =

   typeof request.workerId ===
   "object"

    ? request.workerId?._id

    : request.workerId;

  const worker =
   await User.findById(
    workerId
   );

  if(!worker){

   return res.status(404).json({

    message:
     "Worker not found"

   });

  }

  const currentTotal =
   worker.totalRatings || 0;

  const currentAverage =
   worker.averageRating || 0;

  const updatedAverage =

   (

    (
     currentAverage *
     currentTotal
    ) +

    stars

   ) /

   (
    currentTotal + 1
   );

  worker.averageRating =
   Number(
    updatedAverage.toFixed(1)
   );

  worker.totalRatings =
   currentTotal + 1;

  await worker.save();

  request.isRated = true;

  request.ratedAt =
   new Date();

  await request.save();

  res.status(200).json({

   message:
    "Rating submitted successfully",

   averageRating:
    worker.averageRating,

   totalRatings:
    worker.totalRatings,

   isRated:true

  });

 }

 catch(error){

  console.log(
   "RATING ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to submit rating"

  });

 }

};
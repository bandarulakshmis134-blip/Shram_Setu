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
exports.sendWorkOTP =
 async (req,res)=>{

 try{

  const request =
   await JobRequest.findById(

    req.params.id

   )

   .populate("userId",
     "firstName email"
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
  ALREADY COMPLETED
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
  CLEAR OLD OTP
  */
  request.workOTP = null;

  request.workOTPExpiry = null;

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
   new Date(

    Date.now() +

    5 * 60 * 1000

   );

  await request.save();

  console.log(
 "OTP GENERATED:",
 otp
);

console.log(
 "USER EMAIL:",
 request.userId?.email
);

  /*
  SANSKRIT QUOTES
  */
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

  /*
  EMAIL HTML
  */
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

   <div style="
    background:#2563eb;
    padding:35px;
    text-align:center;
   ">

    <div style="
     display:inline-block;
     background:white;
     padding:10px;
     border-radius:12px;
     margin-bottom:15px;
    ">

     <img
      src="cid:logo"
      alt="Shram Setu Logo"
      style="
       width:70px;
       height:70px;
       object-fit:contain;
       display:block;
      "
     />

    </div>

    <h1 style="
     color:white;
     margin:0;
     font-size:38px;
     font-weight:bold;
    ">

     Shram
     <span style="color:#bfdbfe;">

      Setu

     </span>

    </h1>

    <p style="
     color:#dbeafe;
     margin-top:10px;
    ">

     Connecting Skills to Opportunities

    </p>

   </div>

   <div style="
    padding:40px 35px;
    color:#1f2937;
   ">

    <h2>

     Work Completion Verification

    </h2>

    <p style="
     line-height:1.8;
    ">

     Your worker has requested
     work completion verification.

    </p>

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

    <div style="
     margin-top:30px;
     padding:20px;
     background:#f8fafc;
     border-radius:14px;
     text-align:center;
    ">

     <p style="
      font-size:20px;
      font-weight:bold;
      color:#1e3a8a;
     ">

      ${randomQuote.line}

     </p>

     <p style="
      font-size:14px;
      color:#6b7280;
      font-style:italic;
     ">

      ${randomQuote.meaning}

     </p>

    </div>

    <div style="
     background:#f9fafb;
     border-radius:14px;
     padding:20px;
     margin-top:25px;
    ">

     <p style="
      color:#374151;
      font-size:14px;
      line-height:1.8;
     ">

      ⚠️
      <strong>
       Security Tips
      </strong>

      <br/><br/>

      • Never share this OTP.<br/>
      • OTP expires in 5 minutes.<br/>
      • Verify only after work completion.

     </p>

    </div>

   </div>

  </div>

 </div>
`;

  /*
  SEND EMAIL
  */
 console.log(
 "SENDING OTP EMAIL..."
);

await sendEmail(

 request.userId.email,

 "Shram Setu Work Completion OTP",

 html

);

console.log(
 "OTP EMAIL SENT SUCCESSFULLY"
);

  res.json({

   message:
    "OTP sent successfully",

   expiresIn:300

  });

 }

 catch(error){

  console.log(
   "SEND OTP ERROR:",
   error
  );

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
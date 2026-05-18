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
  ========================
  GENERATE OTP
  ========================
  */
  const otp = Math.floor(

   100000 +
   Math.random() * 900000

  ).toString();

  /*
  ========================
  SAVE OTP
  ========================
  */
  request.workOTP = otp;

  request.workOTPExpiry =

   Date.now() +

   2 * 60 * 1000;

  await request.save();

  /*
  ========================
  SANSKRIT LINES
  ========================
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

  /*
  RANDOM LINE
  */
  const randomQuote =

   sanskritLines[
    Math.floor(
     Math.random() *
     sanskritLines.length
    )
   ];

  /*
  ========================
  EMAIL HTML
  ========================
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

     <!-- HEADER -->
     <div style="
      background:#2563eb;
      padding:35px;
      text-align:center;
     ">

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

       Hello,
       <br/><br/>

       Your worker has requested
       verification for work completion.

       Please use the OTP below
       to securely confirm the work.

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
       margin-top:30px;
       padding:20px;
       background:#f8fafc;
       border-radius:14px;
       text-align:center;
       border:1px solid #e5e7eb;
      ">

       <p style="
        margin:0;
        font-size:20px;
        font-weight:bold;
        color:#1e3a8a;
        line-height:1.8;
       ">

        ${randomQuote.line}

       </p>

       <p style="
        margin-top:12px;
        font-size:14px;
        color:#6b7280;
        font-style:italic;
        line-height:1.7;
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

        • Never share this OTP with anyone.<br/>
        • Shram Setu employees will never ask for your OTP.<br/>
        • This OTP will expire in <strong>2 minutes</strong>.<br/>
        • Only provide this OTP after the work is completed successfully.

       </p>

      </div>

      <!-- FOOTER -->
      <p style="
       margin-top:35px;
       font-size:14px;
       color:#6b7280;
       line-height:1.8;
      ">

       Thank you for using
       <strong>Shram Setu</strong> 🚀

      </p>

     </div>

    </div>

   </div>

  `;

  /*
  ========================
  SEND EMAIL
  ========================
  */
  await sendEmail(

   request.userId.email,

   "Shram Setu Work Completion OTP",

   html

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
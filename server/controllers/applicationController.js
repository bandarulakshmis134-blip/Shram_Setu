const Application = require("../models/Application");

const Job = require("../models/Job");

const Schedule = require("../models/Schedule");

const JobRequest = require("../models/JobRequest");

const Notification = require("../models/Notification");
/*
========================
APPLY FOR JOB
========================
*/
exports.applyJob = async (
 req,
 res
) => {

 try {

  const { jobId } =
   req.body;

  const userId =
   req.user.id;

  /*
  ========================
  GET JOB
  ========================
  */
  const job =
   await Job.findById(
    jobId
   );

  if(!job){

   return res.status(404).json({

    message:
     "Job not found"

   });

  }

  /*
  ========================
  PREVENT DUPLICATE
  ========================
  */
  const existing =
   await Application.findOne({

    job:jobId,

    worker:userId

   });

  if(existing){

   return res.status(400).json({

    message:
     "Already applied"

   });

  }

  /*
  ========================
  CREATE APPLICATION
  ========================
  */
  const application =
   new Application({

    job:jobId,

    worker:userId

   });

  await application.save();

  /*
  ========================
  NOTIFICATION
  ========================
  */
  await Notification.create({

   userId:
    job.postedBy,

   message:
    "You received a new job application",

   type:"application",

   link:"/dashboard"

  });

  res.status(201).json({

   message:
    "Applied successfully"

  });

 }

 catch(error){

  console.log(
   "APPLY ERROR:",
   error
  );

  res.status(500).json({

   message:error.message

  });

 }

};


/*
========================
GET APPLICATIONS
FOR JOB OWNER
========================
*/
exports.getJobApplications =
 async (
  req,
  res
 ) => {

 try {

  const userId =
   req.user.id;

  const jobs =
   await Job.find({

    postedBy:userId

   });

  const jobIds =
   jobs.map(
    (j)=>j._id
   );

  const applications =

   await Application.find({

    job:{
     $in:jobIds
    }

   })

   .populate(

    "worker",

    `
    firstName
    profilePic
    skills
    location
    age
    gender
    about
    rating
    reviews
    `

   )

   .populate(
    "job",
    "title"
   );

  res.json(applications);

 }

 catch (error) {

  console.log(
   "GET ADMIN APPS ERROR:",
   error
  );

  res.status(500).json({

   message:error.message

  });

 }

};



/*
========================
GET WORKER APPLICATIONS
========================
*/
exports.getMyApplications =
 async (
  req,
  res
 ) => {

 try {

  const userId =
   req.user.id;

  let applications =

   await Application.find({

    worker:userId

   })

   .populate("job");

  /*
  REMOVE INVALID JOBS
  */
  const validApplications =
   [];

  for (const app of applications){

   /*
   INVALID JOB
   */
   if(!app.job){

    await Application.findByIdAndDelete(
     app._id
    );

   }

   else{

    validApplications.push(
     app
    );

   }

  }

  res.json(validApplications);

 }

 catch (error) {

  console.log(
   "GET APPLICATIONS ERROR:",
   error
  );

  res.status(500).json({

   message:error.message

  });

 }

};



/*
========================
UPDATE APPLICATION STATUS
========================
*/
exports.updateApplicationStatus =
 async (
  req,
  res
 ) => {

 try {

  const { status } =
   req.body;

  /*
  VALIDATION
  */
  if(

   ![
    "accepted",
    "rejected"
   ].includes(status)

  ){

   return res.status(400).json({

    message:
     "Invalid status"

   });

  }

  /*
  UPDATE APPLICATION
  */
  const application =

   await Application.findByIdAndUpdate(

    req.params.id,

    {
     status
    },

    {
     returnDocument:"after"
    }

   )

   .populate({
    path:"job",
    populate:{
     path:"postedBy"
    }
   })

   .populate("worker");

  /*
  NOT FOUND
  */
  if(!application){

   return res.status(404).json({

    message:
     "Application not found"

   });

  }

  /*
  ACCEPTED
  */
  if(status === "accepted"){

   /*
   UPDATE JOB STATUS
   */
   await Job.findByIdAndUpdate(

    application.job?._id,

    {
     status:"accepted"
    }

   );

   /*
   CHECK EXISTING SCHEDULE
   */
   const existingSchedule =

    await Schedule.findOne({

     job:
      application.job?._id,

     worker:
      application.worker?._id

    });

   /*
   AVOID DUPLICATES
   */
   if(!existingSchedule){

    /*
    CREATE EXPIRY
    */
    let expiryTime =
     new Date();

    expiryTime.setDate(
     expiryTime.getDate() + 3
    );

    /*
    CREATE REAL REQUEST
    */
    const createdRequest =
     await JobRequest.create({

      jobId:
       application.job?._id,

      userId:
       application.job?.postedBy?._id,

      workerId:
       application.worker?._id,

      description:
       application.job?.title,

      location:
       application.job?.location,

      budget:
       application.job?.budget,

      urgency:

       application.job?.urgency ===
       "24hrs"

        ? "24 Hours"

        : application.job?.urgency ===
          "urgent"

          ? "Urgent"

          : "Flexible",

      status:"accepted",

      expiresAt:
       expiryTime

     });

    /*
    CREATE SCHEDULE
    */
    await Schedule.create({

     job:
      application.job?._id,

     worker:
      application.worker?._id,

     client:

      application.job?.postedBy?._id ||

      application.job?.postedBy,

     requestId:
      createdRequest._id,

     title:
      application.job?.title,

     date:
      new Date()

    });

   }

  }

  res.json({

   message:
    `Application ${status}`,

   application

  });

 }

 catch (error) {

  console.log(
   "UPDATE STATUS ERROR:",
   error
  );

  res.status(500).json({

   message:error.message

  });

 }

};



/*
========================
DELETE APPLICATION
========================
*/
exports.deleteApplication =
 async (
  req,
  res
 ) => {

 try {

  const application =

   await Application.findById(
    req.params.id
   );

  /*
  NOT FOUND
  */
  if(!application){

   return res.status(404).json({

    message:
     "Application not found"

   });

  }

  /*
  DELETE
  */
  await Application.findByIdAndDelete(
   req.params.id
  );

  res.json({

   message:
    "Application deleted"

  });

 }

 catch (error) {

  console.log(
   "DELETE APPLICATION ERROR:",
   error
  );

  res.status(500).json({

   message:error.message

  });

 }

};
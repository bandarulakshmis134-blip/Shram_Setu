const Application =
 require("../models/Application");

const Job =
 require("../models/Job");

const Schedule =
 require("../models/Schedule");

const JobRequest =
 require("../models/JobRequest");

/*
========================
APPLY FOR JOB
========================
*/
exports.applyJob = async (
 req,
 res
) => {

 try{

  const { jobId } =
   req.body;

  const userId =
   req.user.id;

  /*
  ========================
  VALIDATION
  ========================
  */
  if(!jobId){

   return res.status(400).json({

    message:
     "Job id is required"

   });

  }

  /*
  ========================
  GET JOB
  ========================
  */
  const job =
   await Job.findById(
    jobId
   );

  /*
  JOB NOT FOUND
  */
  if(!job){

   return res.status(404).json({

    message:
     "Job not found"

   });

  }

  /*
  CANNOT APPLY OWN JOB
  */
  if(

   job.postedBy.toString() ===
   userId

  ){

   return res.status(400).json({

    message:
     "You cannot apply to your own job"

   });

  }

  /*
  JOB ALREADY ASSIGNED
  */
  if(
   job.status === "accepted"
  ){

   return res.status(400).json({

    message:
     "Job already assigned"

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

  res.status(201).json({

   message:
    "Application submitted",

   application

  });

 }

 catch(error){

  console.log(
   "APPLY JOB ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to apply"

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

 try{

  const userId =
   req.user.id;

  /*
  ========================
  GET USER JOBS
  ========================
  */
  const jobs =
   await Job.find({

    postedBy:userId

   });

  const jobIds =
   jobs.map(
    (j)=>j._id
   );

  /*
  ========================
  GET APPLICATIONS
  ========================
  */
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
    averageRating
    totalRatings
    `

   )

   .populate(
    "job",
    "title status"
   )

   .sort({

    createdAt:-1

   });

  res.json(applications);

 }

 catch(error){

  console.log(
   "GET ADMIN APPS ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to fetch applications"

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

 try{

  const userId =
   req.user.id;

  let applications =

   await Application.find({

    worker:userId

   })

   .populate("job")

   .sort({

    createdAt:-1

   });

  /*
  ========================
  REMOVE INVALID JOBS
  ========================
  */
  const validApplications =
   [];

  for(
   const app of applications
  ){

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

 catch(error){

  console.log(
   "GET APPLICATIONS ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to fetch applications"

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

 try{

  const { status } =
   req.body;

  /*
  ========================
  VALIDATION
  ========================
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
  ========================
  GET APPLICATION
  ========================
  */
  const application =

   await Application.findById(
    req.params.id
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
  ========================
  ONLY OWNER
  ========================
  */
  if(

   application.job?.postedBy?._id
    .toString() !==
   req.user.id

  ){

   return res.status(403).json({

    message:
     "Unauthorized"

   });

  }

  /*
  ========================
  UPDATE STATUS
  ========================
  */
  application.status =
   status;

  await application.save();

  /*
  ========================
  ACCEPT APPLICATION
  ========================
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
   AUTO REJECT OTHERS
   */
   await Application.updateMany(

    {

     job:
      application.job?._id,

     _id:{
      $ne:application._id
     }

    },

    {

     status:"rejected"

    }

   );

   /*
   CHECK EXISTING REQUEST
   */
   const existingRequest =

    await JobRequest.findOne({

     jobId:
      application.job?._id,

     workerId:
      application.worker?._id

    });

   /*
   PREVENT DUPLICATE
   */
   if(!existingRequest){

    /*
    CREATE EXPIRY
    */
    const expiryTime =
     new Date();

    expiryTime.setDate(

     expiryTime.getDate() + 3

    );

    /*
    CREATE REQUEST
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

 catch(error){

  console.log(
   "UPDATE STATUS ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to update application"

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

 try{

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
  ONLY OWNER
  */
  if(

   application.worker.toString() !==
   req.user.id

  ){

   return res.status(403).json({

    message:
     "Unauthorized"

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

 catch(error){

  console.log(
   "DELETE APPLICATION ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to delete application"

  });

 }

};
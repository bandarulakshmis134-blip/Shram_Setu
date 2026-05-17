const Job =
 require("../models/Job");

const Application =
 require("../models/Application");

const User =
 require("../models/User");

/*
============================
CREATE JOB
============================
Automatically sets expiry time
based on urgency
*/
exports.createJob =
 async (req,res)=>{

 try{

  const {

   title,
   category,
   location,
   budget,
   urgency,
   description

  } = req.body;

  let expiryDate =
   new Date();

  /*
  SET EXPIRY
  */
  if(
   urgency === "urgent"
  ){

   expiryDate.setHours(

    expiryDate.getHours()
    + 5

   );

  }

  else if(
   urgency === "24hrs"
  ){

   expiryDate.setHours(

    expiryDate.getHours()
    + 24

   );

  }

  else{

   expiryDate.setDate(

    expiryDate.getDate()
    + 3

   );

  }

  /*
  CREATE JOB
  */
  const newJob =
   new Job({

    title,
    category,
    location,

    budget:Number(
     budget
    ),

    urgency,
    description,

    expiryDate,

    postedBy:
     req.user.id

   });

  await newJob.save();

  res.status(201).json({

   message:
    "Job created successfully",

   job:newJob

  });

 }

 catch(error){

  console.log(
   "CREATE JOB ERROR:",
   error
  );

  res.status(500).json({

   message:error.message

  });

 }

};

/*
============================
GET JOBS
============================
Only:
- matching worker skills
- newest updated jobs first
- non expired
- non accepted
============================
*/
exports.getJobs =
 async (req,res)=>{

 try{

  const page =
   Number(req.query.page)
   || 1;

  const limit = 6;

  const skip =
   (page - 1) * limit;

  /*
  USER ID
  */
  const userId =
   req.query.userId;

  /*
  ============================
  GET USER
  ============================
  */
  const user =
   await User.findById(
    userId
   );

  /*
  ============================
  GET WORKER SKILLS
  ============================
  */
  const userSkills =
   user?.skills || [];

  /*
  ============================
  ACCEPTED JOB IDS
  ============================
  */
  const acceptedApplications =
   await Application.find({

    status:"accepted"

   });

  const acceptedJobIds =
   acceptedApplications.map(

    (app)=>app.job

   );

  /*
  ============================
  FILTER
  ============================
  */
  const filter = {

   expiryDate:{
    $gt:new Date()
   },

   _id:{
    $nin:acceptedJobIds
   }

  };

  /*
  ============================
  ONLY MATCHING SERVICES
  ============================
  */
  if(userSkills.length > 0){

   filter.category = {

    $in:userSkills

   };

  }

  /*
  ============================
  FETCH JOBS
  ============================
  */
  const jobs =
   await Job.find(filter)

   .populate(
    "postedBy",
    "firstName"
   )

   /*
   NEWEST UPDATED FIRST
   */
   .sort({

    updatedAt:-1,

    createdAt:-1

   })

   .skip(skip)

   .limit(limit);

  /*
  ============================
  TOTAL JOBS
  ============================
  */
  const totalJobs =
   await Job.countDocuments(
    filter
   );

  res.json({

   jobs,

   totalPages:
    Math.ceil(
     totalJobs / limit
    ),

   currentPage:page

  });

 }

 catch(error){

  console.log(
   "GET JOB ERROR:",
   error
  );

  res.status(500).json({

   message:error.message

  });

 }

};

/*
============================
GET MY JOBS
============================
*/
exports.getMyJobs =
 async (req,res)=>{

 try{

  const jobs =
   await Job.find({

    postedBy:
     req.params.userId,

    expiryDate:{
     $gt:new Date()
    }

   })

   .sort({

    updatedAt:-1,

    createdAt:-1

   });

  res.json(
   jobs
  );

 }

 catch(error){

  console.log(

   "GET MY JOBS ERROR:",

   error

  );

  res.status(500).json({

   message:error.message

  });

 }

};
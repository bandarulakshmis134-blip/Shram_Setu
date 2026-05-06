const Job = require("../models/Job");
const Application = require("../models/Application");

/*
============================
CREATE JOB
============================
Automatically sets expiry time based on urgency
*/

exports.createJob = async (req,res)=>{

 try{

  const {
   title,
   category,
   location,
   budget,
   urgency,
   description
  } = req.body;

  let expiryDate = new Date();

  /*
  set expiry time
  */

  if(urgency === "urgent"){

   expiryDate.setHours(
    expiryDate.getHours() + 5
   );

  }

  else if(urgency === "24hrs"){

   expiryDate.setHours(
    expiryDate.getHours() + 24
   );

  }

  else{

   expiryDate.setDate(
    expiryDate.getDate() + 3
   );

  }

  /*
  attach user
  */
  const newJob = new Job({

   title,
   category,
   location,

   budget:Number(budget),

   urgency,
   description,

   expiryDate,

   postedBy: req.user.id

  });

  await newJob.save();

  res.status(201).json({

   message:"Job created successfully",
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
GET JOBS WITH PAGINATION
============================
Only returns jobs that are NOT expired
and NOT accepted already
*/

exports.getJobs = async (req,res)=>{

 try{

  const page = Number(req.query.page) || 1;

  const limit = 6;

  const skip = (page - 1) * limit;

  /*
  GET ACCEPTED JOB IDS
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
  FETCH AVAILABLE JOBS
  */
  const jobs = await Job.find({

   expiryDate:{ $gt:new Date() },

   _id:{
    $nin: acceptedJobIds
   }

  })

  .populate(
   "postedBy",
   "firstName"
  )

  .sort({ createdAt:-1 })

  .skip(skip)

  .limit(limit);

  /*
  TOTAL AVAILABLE JOBS
  */
  const totalJobs =
   await Job.countDocuments({

    expiryDate:{
     $gt:new Date()
    },

    _id:{
     $nin: acceptedJobIds
    }

   });

  res.json({

   jobs,

   totalPages: Math.ceil(
    totalJobs / limit
   ),

   currentPage: page

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
Used for Dashboard
*/

exports.getMyJobs = async (req,res)=>{

 try{

  const jobs = await Job.find({

   postedBy: req.params.userId,

   expiryDate:{
    $gt:new Date()
   }

  })

  .sort({ createdAt:-1 });

  res.json(jobs);

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
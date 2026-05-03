const Job = require("../models/Job");


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

   // expires in 5 hours
   expiryDate.setHours(

    expiryDate.getHours() + 5

   );

  }

  else if(urgency === "24hrs"){

   // expires in 24 hours
   expiryDate.setHours(

    expiryDate.getHours() + 24

   );

  }

  else{

   // flexible → expires in 3 days
   expiryDate.setDate(

    expiryDate.getDate() + 3

   );

  }


  const newJob = new Job({

   title,
   category,
   location,

   budget:Number(budget),

   urgency,

   description,

   expiryDate

  });


  await newJob.save();


  res.status(201).json({

   message:"Job created successfully",

   job:newJob

  });

 }

 catch(error){

  console.log("CREATE JOB ERROR:",error);


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
*/

exports.getJobs = async (req,res)=>{

 try{

  const page = Number(req.query.page) || 1;

  const limit = 6;

  const skip = (page - 1) * limit;


  /*
  only fetch active jobs
  */

  const jobs = await Job.find({

   expiryDate:{ $gt:new Date() }

  })

  .sort({ createdAt:-1 })

  .skip(skip)

  .limit(limit);



  /*
  count active jobs
  */

  const totalJobs = await Job.countDocuments({

   expiryDate:{ $gt:new Date() }

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

  console.log("GET JOB ERROR:",error);


  res.status(500).json({

   message:error.message

  });

 }

};

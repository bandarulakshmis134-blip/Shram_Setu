const Worker = require("../models/Worker");
const User = require("../models/User");


/*
=====================================
1. REGISTER WORKER
=====================================
*/

exports.registerWorker = async (req, res) => {

  try {

    const {

      userId,

      registrationType,

      firstName,
      groupName,

      mobile,
      location,
      experience,
      skills,

      description,

      price,
      priceType,

      age,
      gender,
      aadhaar,

      members

    } = req.body;


    // save worker
    const newWorker = new Worker({

      userId,

      registrationType,

      firstName,
      groupName,

      mobile,
      location,
      experience,
      skills,

      description,

      price,
      priceType,

      age,
      gender,
      aadhaar,

      members

    });


    await newWorker.save();


    // update USER also
    await User.findByIdAndUpdate(

      userId,

      {

        skills,

        mobile,

        location,

        description,

        role: "worker"

      },

      { new: true }

    );


    res.status(201).json({

      message: "Worker registered successfully",

      worker: newWorker

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};



/*
=====================================
2. GET TOP WORKERS
=====================================
*/

/*
=====================================
2. GET TOP WORKERS
=====================================
*/
exports.getTopWorkers =
 async (req,res)=>{

 try{

  const {
   userId
  } = req.query;

  /*
  ============================
  GET CURRENT USER LOCATION
  ============================
  */
  let userLocation = "";

  if(userId){

   const currentUser =
    await User.findById(
     userId
    );

   userLocation =

    currentUser?.location
     ?.toLowerCase()
     ?.trim() || "";

  }

  /*
  ============================
  ONLY INDIVIDUAL WORKERS
  ============================
  */
  const workers =
   await Worker.find({

    registrationType:
     "individual"

   })

   .populate(

    "userId",

    "profilePic averageRating totalRatings"

   )

   .lean();

  /*
  ============================
  MERGE USER DATA
  ============================
  */
  let mergedWorkers =
   workers.map((worker)=>({

    ...worker,

    profilePic:
     worker.userId?.profilePic || "",

    averageRating:
     worker.userId?.averageRating || 0,

    totalRatings:
     worker.userId?.totalRatings || 0

   }));

  /*
  ============================
  SAME LOCATION FIRST
  ============================
  */
  mergedWorkers =
   mergedWorkers.filter((worker)=>

    worker.location
     ?.toLowerCase()
     ?.includes(
      userLocation
     )

   );

  /*
  ============================
  SORT BY:
  1. RATING
  2. TOTAL RATINGS
  ============================
  */
  mergedWorkers.sort((a,b)=>{

   if(

    b.averageRating !==
    a.averageRating

   ){

    return (

     b.averageRating -
     a.averageRating

    );

   }

   return (

    b.totalRatings -
    a.totalRatings

   );

  });

  /*
  ============================
  UNIQUE SERVICES
  ============================
  */
  const uniqueWorkers = [];

  const usedSkills =
   new Set();

 /*
============================
AGGREGATE RANKING
============================
*/
mergedWorkers.sort((a,b)=>{

 /*
 COMBINED SCORE
 */

 const aScore =

  (a.averageRating * 10) +

  (a.totalRatings || 0);

 const bScore =

  (b.averageRating * 10) +

  (b.totalRatings || 0);

 return bScore - aScore;

});
  /*
  ============================
  FINAL TOP 3
  ============================
  */
  const topWorkers =
   uniqueWorkers.slice(0,3);

  res.json(
   topWorkers
  );

 }

 catch(error){

  res.status(500).json({

   message:error.message

  });

 }

};



/*
=====================================
3. GET WORKER BY ID
=====================================
*/

exports.getWorkerById = async (req, res) => {

  try {

    const worker = await Worker.findById(

      req.params.id

    );


    if (!worker) {

      return res.status(404).json({

        message: "Worker not found"

      });

    }


    res.json(worker);

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};



/*
=====================================
4. UPDATE WORKER
=====================================
*/
exports.updateWorkerSkills = async (req,res)=>{

 try{

  const {

   userId,

   skills,

   description

  } = req.body;

  if(!skills){

   return res.status(400).json({

    message:"Skills required"

   });

  }

  const worker = await Worker.findOneAndUpdate(

   { userId:userId },

   {

    skills:skills,

    description:description

   },

   { returnDocument:"after" }

  );

  if(!worker){

   return res.status(404).json({

    message:"Worker not found"

   });

  }

  res.json({

   message:"Worker skills updated",

   worker

  });

 }

 catch(error){

  res.status(500).json({

   message:error.message

  });

 }

};



/*
=====================================
5. DELETE WORKER
=====================================
*/

exports.deleteWorker = async (req, res) => {

  try {

    await Worker.findByIdAndDelete(

      req.params.id

    );


    res.json({

      message: "Worker deleted successfully"

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

exports.checkIfWorker = async (req,res)=>{

 try{

   const worker = await Worker.findOne({

     userId: req.params.userId

   });

   res.json({

     isWorker: !!worker

   });

 }

 catch(error){

   res.status(500).json({

     message:error.message

   });

 }

};

exports.getWorkerCountBySkill = async (req,res)=>{

 try{

  const workers = await Worker.find({}, "skills");


  const skillMap = {

   Construction: "Construction Workers",
   Masons: "Masons / Mestris",
   Loading: "Loading & Unloading",
   Digging: "Digging / Drilling",
   Electrician: "Electricians",
   Plumber: "Plumbers",
   Carpenter: "Carpenters",
   Appliance: "Appliance Repair",
   Cleaning: "Housekeepers / Cleaners",
   Painting: "Painters",
   PestControl: "Pest Control",
   FarmWorkers: "Farm Workers",
   PetCare: "Pet Caretakers",
   Drivers: "Designated Drivers",
   ChildCare: "Child Care Takers",
   RMPDoctors: "RMP Doctors",
   Other: "Other"

  };


  const counts = {};

  Object.values(skillMap).forEach(service=>{
   counts[service] = 0;
  });


  workers.forEach(worker=>{

   let skills = worker.skills;

   // 🔥 SAFE FIX
   if(!skills) return;

   if(!Array.isArray(skills)){
    skills = [skills];
   }

   skills.forEach(skill=>{

    if(!skill) return;

    const mappedService = skillMap[skill] || "Other";

    if(counts[mappedService] !== undefined){
     counts[mappedService]++;
    }

   });

  });


  res.json(counts);

 }

 catch(error){

  console.log("COUNT ERROR:", error);

  res.status(500).json({
   message:error.message
  });

 }

};


/*
=====================================
SEARCH WORKERS
=====================================
*/

/*
=====================================
SEARCH WORKERS
=====================================
*/

exports.searchWorkers = async (req,res)=>{

 try{

  const {
   category,
   location,
   search,
   rating,
   userId,
   registrationType,
   page = 1
  } = req.query;

  /*
  =============================
  PAGINATION
  =============================
  */
  const limit = 12;

  const skip =
   (Number(page) - 1) * limit;

  const query = {};

  /*
  =============================
  EXCLUDE OWN PROFILE
  =============================
  */
  if(userId){

   query.userId = {
    $ne:userId
   };

  }

/*
=============================
CATEGORY FILTER
CASE INSENSITIVE
=============================
*/
if(category){

 query.skills = {

  $elemMatch:{

   $regex:category,

   $options:"i"

  }

 };

}

  /*
  =============================
  LOCATION FILTER
  =============================
  */
  if(location){

   query.location = {

    $regex:location,

    $options:"i"

   };

  }

  /*
  =============================
  REGISTRATION TYPE
  =============================
  */
  if(registrationType){

   query.registrationType =
    registrationType;

  }

  /*
  =============================
  SEARCH FILTER
  =============================
  */
  if(search){

   const searchRegex =
    new RegExp(
     search,
     "i"
    );

   query.$or = [

    {
     firstName:
      searchRegex
    },

    {
     groupName:
      searchRegex
    },

    {
     location:
      searchRegex
    },

    {
     skills:{
      $in:[searchRegex]
     }
    }

   ];

  }

  /*
  =============================
  GET USER LOCATION
  =============================
  */
  let userLocation = "";

  if(userId){

   const currentUser =
    await User.findById(
     userId
    );

   userLocation =

    currentUser?.location
     ?.toLowerCase()
     ?.trim() || "";

  }

  /*
  =============================
  FETCH WORKERS
  =============================
  */
  const workers =
   await Worker.find(query)

   .populate(

    "userId",

    "profilePic averageRating totalRatings"

   )

   .lean();

  /*
  =============================
  MERGE USER DATA
  =============================
  */
  let result =
   workers.map((worker)=>({

    ...worker,

    profilePic:
     worker.userId?.profilePic || "",

    averageRating:
     worker.userId?.averageRating || 0,

    totalRatings:
     worker.userId?.totalRatings || 0

   }));

  /*
  =============================
  RATING FILTER
  =============================
  */
  if(Number(rating) > 0){

   result = result.filter(

    (worker)=>

     worker.averageRating >=
     Number(rating)

   );

  }

  /*
  =============================
  SMART SORTING
  =============================
  */
  result.sort((a,b)=>{

   /*
   ===================================
   LOCATION PRIORITY
   ===================================
   */
   const aSameLocation =

    a.location
     ?.toLowerCase()
     ?.includes(
      userLocation
     );

   const bSameLocation =

    b.location
     ?.toLowerCase()
     ?.includes(
      userLocation
     );

   /*
   ONLY APPLY LOCATION PRIORITY
   WHEN LOCATION FILTER NOT USED
   */
   if(!location){

    if(
     aSameLocation &&
     !bSameLocation
    ){

     return -1;

    }

    if(
     !aSameLocation &&
     bSameLocation
    ){

     return 1;

    }

   }

   /*
   ===================================
   HIGHER RATING FIRST
   ===================================
   */
   if(

    b.averageRating !==
    a.averageRating

   ){

    return (

     b.averageRating -
     a.averageRating

    );

   }

   /*
   ===================================
   MORE TOTAL RATINGS
   ===================================
   */
   if(

    b.totalRatings !==
    a.totalRatings

   ){

    return (

     b.totalRatings -
     a.totalRatings

    );

   }

   /*
   ===================================
   ALPHABETICAL ORDER
   ===================================
   */
   return (

    (a.firstName ||
     a.groupName ||
     "")

    .localeCompare(

     b.firstName ||
     b.groupName ||
     ""

    )

   );

  });

  /*
  =============================
  PAGINATION
  =============================
  */
  const paginatedWorkers =
   result.slice(

    skip,

    skip + limit

   );

  res.json(
   paginatedWorkers
  );

 }

 catch(error){

  console.log(
   "SEARCH WORKERS ERROR:",
   error
  );

  res.status(500).json({

   message:error.message

  });

 }

};

exports.syncWorkerSkills = async (req,res)=>{

 try{

  const {

   userId,

   skills,

   description

  } = req.body;

  const updatedWorker = await Worker.findOneAndUpdate(

   { userId:userId },

   {

    skills:skills,

    description:description

   },

   { returnDocument:"after" }

  );

  if(!updatedWorker){
   return res.status(404).json({
    message:"Worker not found"
   });
  }

  res.json(updatedWorker);

 }

 catch(error){

  console.log("SYNC ERROR:", error);

  res.status(500).json({
   message:error.message
  });

 }

};
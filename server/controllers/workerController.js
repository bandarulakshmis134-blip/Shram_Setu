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

exports.getTopWorkers = async (
 req,
 res
) => {

 try {

  const workers =
   await Worker.find()

   .populate(

    "userId",

    "profilePic averageRating totalRatings"

   )

   .lean();

  /*
  MERGE USER DATA
  */
  const mergedWorkers =
   workers.map((worker)=>({

    ...worker,

    profilePic:
     worker.userId?.profilePic || "",

    averageRating:
     worker.userId?.averageRating || 0,

    totalRatings:
     worker.userId?.totalRatings || 0

   }));

  res.json(mergedWorkers);

 }

 catch (error) {

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
   userId,
   registrationType
  } = req.query;

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
 =============================
 */
  if(category){

   query.skills = {
    $in:[category]
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
REGISTRATION TYPE FILTER
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

   const searchText =
    search.toString().trim();

   if(searchText.length > 0){

    const searchRegex =
     new RegExp(
      searchText,
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

  }

  const workers =
   await Worker.find(query)

   .populate(

    "userId",

    "profilePic averageRating totalRatings"

   )

   .lean();

  /*
  MERGE USER DATA
  */
  const result =
   workers.map((w)=>({

    ...w,

    profilePic:
     w.userId?.profilePic || "",

    averageRating:
     w.userId?.averageRating || 0,

    totalRatings:
     w.userId?.totalRatings || 0

   }));

  res.json(result);

 }

 catch(error){

  console.log(
   "ERROR:",
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
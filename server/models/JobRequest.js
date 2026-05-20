const mongoose =
 require("mongoose");

const jobRequestSchema =
 new mongoose.Schema(

  {

   /*
   =========================
   LINKED JOB (OPTIONAL)
   =========================
   */
   jobId:{

    type:
     mongoose.Schema.Types.ObjectId,

    ref:"Job",

    default:null,

    index:true

   },

   /*
   =========================
   CLIENT / USER
   =========================
   */
   userId:{

    type:
     mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true,

    index:true

   },

   /*
   =========================
   WORKER
   =========================
   */
   workerId:{

    type:
     mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true,

    index:true

   },

   /*
   =========================
   DESCRIPTION
   =========================
   */
   description:{

    type:String,

    required:true,

    trim:true,

    maxlength:1000

   },

   /*
   =========================
   LOCATION
   =========================
   */
   location:{

    type:String,

    required:true,

    trim:true,

    maxlength:300

   },

   /*
   =========================
   BUDGET
   =========================
   */
   budget:{

    type:Number,

    required:true,

    min:1

   },

   /*
   =========================
   URGENCY
   =========================
   */
   urgency:{

    type:String,

    enum:[

     "Flexible",

     "24 Hours",

     "Urgent"

    ],

    default:"Flexible",

    index:true

   },

   /*
   =========================
   STATUS
   =========================
   */
   status:{

    type:String,

    enum:[

     "pending",

     "accepted",

     "rejected",

     "in-progress",

     "completed"

    ],

    default:"pending",

    index:true

   },

   /*
   =========================
   OTP
   =========================
   */
   workOTP:{

    type:String,

    default:null,

    select:false

   },

   /*
   =========================
   OTP EXPIRY
   =========================
   */
   workOTPExpiry:{

    type:Date,

    default:null,

    select:false

   },

   /*
   =========================
   RATING
   =========================
   */
   isRated:{

    type:Boolean,

    default:false,

    index:true

   },

   ratedAt:{

    type:Date,

    default:null

   },

   /*
   =========================
   AUTO DELETE
   =========================
   */
   expiresAt:{

    type:Date,

    required:true,

    index:true

   }

  },

  {

   timestamps:true

  }

);

/*
=========================
TTL INDEX
=========================
*/
jobRequestSchema.index(

 {

  expiresAt:1

 },

 {

  expireAfterSeconds:0

 }

);

/*
=========================
FAST QUERIES
=========================
*/
jobRequestSchema.index({

 userId:1,

 status:1

});

jobRequestSchema.index({

 workerId:1,

 status:1

});

jobRequestSchema.index({

 createdAt:-1

});

/*
=========================
HIDE OTP
=========================
*/
jobRequestSchema.set(

 "toJSON",

 {

  transform:(doc,ret)=>{

   delete ret.workOTP;

   delete ret.workOTPExpiry;

   return ret;

  }

 }

);

module.exports =
 mongoose.model(

  "JobRequest",

  jobRequestSchema

 );
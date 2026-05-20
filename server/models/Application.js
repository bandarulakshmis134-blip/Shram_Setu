const mongoose =
 require("mongoose");

const applicationSchema =
 new mongoose.Schema(

  {

   /*
   =========================
   JOB
   =========================
   */
   job:{

    type:
     mongoose.Schema.Types.ObjectId,

    ref:"Job",

    required:true,

    index:true

   },

   /*
   =========================
   WORKER
   =========================
   */
   worker:{

    type:
     mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true,

    index:true

   },

   /*
   =========================
   APPLICATION STATUS
   =========================
   */
   status:{

    type:String,

    enum:[

     "pending",

     "accepted",

     "rejected"

    ],

    default:"pending",

    index:true

   },

   /*
   =========================
   RATING STATUS
   =========================
   */
   isRated:{

    type:Boolean,

    default:false,

    index:true

   },

   /*
   =========================
   RATED DATE
   =========================
   */
   ratedAt:{

    type:Date,

    default:null

   }

  },

  {

   timestamps:true

  }

);

/*
=========================
PREVENT DUPLICATE APPLY
=========================
*/
applicationSchema.index(

 {

  job:1,

  worker:1

 },

 {

  unique:true

 }

);

/*
=========================
FAST DASHBOARD QUERIES
=========================
*/
applicationSchema.index({

 worker:1,

 status:1

});

applicationSchema.index({

 job:1,

 status:1

});

applicationSchema.index({

 createdAt:-1

});

/*
=========================
SAFE JSON TRANSFORM
=========================
*/
applicationSchema.set(

 "toJSON",

 {

  transform:(doc,ret)=>{

   return ret;

  }

 }

);

module.exports =
 mongoose.model(

  "Application",

  applicationSchema

 );
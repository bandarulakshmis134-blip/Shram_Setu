const mongoose =
 require("mongoose");

const notificationSchema =
 new mongoose.Schema(

  {

   /*
   RECEIVER
   */
   userId:{

    type:
     mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true

   },

   /*
   MESSAGE
   */
   message:{

    type:String,

    required:true

   },

   /*
   TYPE
   */
   type:{

    type:String,

    enum:[
     "request",
     "application",
     "message"
    ],

    required:true

   },

   /*
   READ STATUS
   */
   isRead:{

    type:Boolean,

    default:false

   },

   /*
   OPTIONAL LINK
   */
   link:{

    type:String,

    default:""

   }

  },

  {

   timestamps:true

  }

 );

module.exports =
 mongoose.model(

  "Notification",

  notificationSchema

 );
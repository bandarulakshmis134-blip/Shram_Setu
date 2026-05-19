const mongoose =
 require("mongoose");

const messageSchema =
 new mongoose.Schema(

  {

   senderId:{

    type:
     mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true

   },

   receiverId:{

    type:
     mongoose.Schema.Types.ObjectId,

    ref:"User",

    required:true

   },

   text:{

    type:String,

    required:true

   },

   /*
   =========================
   MESSAGE SEEN STATUS
   =========================
   */
   isSeen:{

    type:Boolean,

    default:false

   }

  },

  {

   timestamps:true

  }

 );

 /*
=========================
MESSAGE INDEXES
=========================
*/
messageSchema.index({

 senderId:1,
 receiverId:1,
 createdAt:-1

});

messageSchema.index({

 receiverId:1,
 isSeen:1

});

module.exports =
 mongoose.model(

  "Message",

  messageSchema

 );

 
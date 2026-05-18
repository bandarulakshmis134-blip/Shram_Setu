const Message =
 require("../models/Message");

const User =
 require("../models/User");

const Notification =
 require("../models/Notification");

const Worker =
 require("../models/Worker");

/*
=====================================
1. GET MESSAGES BETWEEN TWO USERS
=====================================
*/
exports.getMessages =
 async (req,res)=>{

 try{

  let {
   userId,
   receiverId
  } = req.query;

  /*
  NORMALIZE
  */
  userId =
   userId.toString();

  receiverId =
   receiverId.toString();

  const messages =
   await Message.find({

    $or:[

     {

      senderId:userId,

      receiverId:receiverId

     },

     {

      senderId:receiverId,

      receiverId:userId

     }

    ]

   })

   .sort({

    createdAt:1

   });

  res.json(
   messages
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
2. GET CONVERSATIONS
=====================================
*/
exports.getConversations =
 async (req,res)=>{

 try{

  const {
   userId
  } = req.query;

  /*
  =====================
  GET ALL USER MESSAGES
  =====================
  */
  const messages =
   await Message.find({

    $or:[

     {
      senderId:userId
     },

     {
      receiverId:userId
     }

    ]

   })

   .sort({

    createdAt:-1

   });

  /*
  =====================
  UNIQUE USER IDS
  =====================
  */
  const uniqueUserIds =
   new Set();

  messages.forEach(msg=>{

   if(

    msg.senderId.toString() !==
    userId

   ){

    uniqueUserIds.add(

     msg.senderId.toString()

    );

   }

   if(

    msg.receiverId.toString() !==
    userId

   ){

    uniqueUserIds.add(

     msg.receiverId.toString()

    );

   }

  });

  /*
  =====================
  FETCH USERS
  =====================
  */
  const users =
   await User.find({

    _id:{

     $in:Array.from(
      uniqueUserIds
     )

    }

   })

   .select(

    "firstName lastName email"

   );

  /*
  =====================================
  FORMAT CONVERSATIONS
  =====================================
  */
  const formatted =
   await Promise.all(

    users.map(async (u)=>{

     /*
     =====================
     CHECK WORKER PROFILE
     =====================
     */
     const workerProfile =
      await Worker.findOne({

       userId:u._id

      });

     /*
     =====================
     LAST MESSAGE
     =====================
     */
     const lastMessage =
      await Message.findOne({

       $or:[

        {

         senderId:userId,

         receiverId:u._id

        },

        {

         senderId:u._id,

         receiverId:userId

        }

       ]

      })

      .sort({

       createdAt:-1

      });

     /*
     =====================
     UNREAD COUNT
     =====================
     */
     const unreadCount =
      await Message.countDocuments({

       senderId:u._id,

       receiverId:userId,

       isSeen:false

      });

     /*
     =====================
     RETURN FORMATTED USER
     =====================
     */
     return{

      _id:u._id,

      name:`${

        u.firstName || ""

       } ${

        u.lastName || ""

       }`.trim(),

      email:u.email,

      /*
      =====================
      WORKER STATUS
      =====================
      */
      isWorker:
       !!workerProfile,

      workerId:
       workerProfile?._id || null,

      /*
      =====================
      CHAT DATA
      =====================
      */
      unreadCount,

      lastMessage:
       lastMessage?.text || "",

      lastMessageTime:
       lastMessage?.createdAt || null

     };

    })

   );

  /*
  =====================
  SEND RESPONSE
  =====================
  */
  res.json(
   formatted
  );

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:error.message

  });

 }

};

/*
=====================================
3. SEND MESSAGE
=====================================
*/
exports.sendMessage =
 async (req,res)=>{

 try{

  const {

   senderId,
   receiverId,
   text

  } = req.body;

  /*
  =========================
  CREATE MESSAGE
  =========================
  */
  const newMessage =
   new Message({

    senderId,
    receiverId,
    text

   });

  await newMessage.save();

  /*
  =========================
  CREATE NOTIFICATION
  =========================
  */
  await Notification.create({

   userId:receiverId,

   message:
    "You received a new message",

   type:"message",

   link:"/messages"

  });

  /*
  =========================
  RESPONSE
  =========================
  */
  res.status(201).json({

   message:
    "Message sent successfully",

   newMessage

  });

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:error.message

  });

 }

};

/*
=====================================
4. MARK MESSAGES AS SEEN
=====================================
*/
exports.markMessagesAsSeen =
 async (req,res)=>{

 try{

  const {

   senderId,
   receiverId

  } = req.body;

  /*
  =========================
  MARK RECEIVED MESSAGES
  =========================
  */
  await Message.updateMany(

   {

    senderId,

    receiverId,

    isSeen:false

   },

   {

    $set:{

     isSeen:true

    }

   }

  );

  /*
  =========================
  RESPONSE
  =========================
  */
  res.json({

   message:
    "Messages marked as seen"

  });

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:error.message

  });

 }

};
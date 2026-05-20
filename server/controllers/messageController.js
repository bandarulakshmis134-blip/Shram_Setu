const Message =
 require("../models/Message");

const User =
 require("../models/User");

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
  =========================
  VALIDATION
  =========================
  */
  if(

   !userId ||

   !receiverId

  ){

   return res.status(400).json({

    message:
     "Missing user ids"

   });

  }

  /*
  =========================
  NORMALIZE IDS
  =========================
  */
  userId =
   userId.toString();

  receiverId =
   receiverId.toString();

  /*
  =========================
  FETCH MESSAGES
  =========================
  */
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

  /*
  =========================
  RESPONSE
  =========================
  */
  res.json(messages);

 }

 catch(error){

  console.log(
   "GET MESSAGES ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to fetch messages"

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
  =========================
  VALIDATION
  =========================
  */
  if(!userId){

   return res.status(400).json({

    message:
     "User id is required"

   });

  }

  /*
  =========================
  GET ALL USER MESSAGES
  =========================
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
  =========================
  UNIQUE USER IDS
  =========================
  */
  const uniqueUserIds =
   new Set();

  messages.forEach((msg)=>{

   /*
   OTHER USER
   */
   const otherUserId =

    msg.senderId.toString() ===
    userId

     ? msg.receiverId.toString()

     : msg.senderId.toString();

   uniqueUserIds.add(
    otherUserId
   );

  });

  /*
  =========================
  FETCH USERS
  =========================
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
  =========================
  FORMAT CONVERSATIONS
  =========================
  */
  const formatted =
   await Promise.all(

    users.map(async (u)=>{

     /*
     =========================
     WORKER PROFILE
     =========================
     */
     const workerProfile =
      await Worker.findOne({

       userId:u._id

      });

     /*
     =========================
     LAST MESSAGE
     =========================
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
     =========================
     UNREAD COUNT
     =========================
     */
     const unreadCount =
      await Message.countDocuments({

       senderId:u._id,

       receiverId:userId,

       isSeen:false

      });

     /*
     =========================
     RETURN FORMATTED USER
     =========================
     */
     return{

      _id:u._id,

      name:`${

       u.firstName || ""

      } ${

       u.lastName || ""

      }`.trim(),

      email:
       u.email || "",

      /*
      =========================
      WORKER STATUS
      =========================
      */
      isWorker:
       !!workerProfile,

      workerId:
       workerProfile?._id || null,

      /*
      =========================
      CHAT DATA
      =========================
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
  =========================
  SORT LATEST FIRST
  =========================
  */
  formatted.sort(

   (a,b)=>

    new Date(

     b.lastMessageTime || 0

    ) -

    new Date(

     a.lastMessageTime || 0

    )

  );

  /*
  =========================
  RESPONSE
  =========================
  */
  res.json(formatted);

 }

 catch(error){

  console.log(
   "GET CONVERSATIONS ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to fetch conversations"

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
  VALIDATION
  =========================
  */
  if(

   !senderId ||

   !receiverId

  ){

   return res.status(400).json({

    message:
     "Missing sender or receiver"

   });

  }

  /*
  EMPTY MESSAGE
  */
  if(!text?.trim()){

   return res.status(400).json({

    message:
     "Message cannot be empty"

   });

  }

  /*
  =========================
  CREATE MESSAGE
  =========================
  */
  const newMessage =
   new Message({

    senderId,

    receiverId,

    text:text.trim()

   });

  await newMessage.save();

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

  console.log(
   "SEND MESSAGE ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to send message"

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
  VALIDATION
  =========================
  */
  if(

   !senderId ||

   !receiverId

  ){

   return res.status(400).json({

    message:
     "Missing sender or receiver"

   });

  }

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

  console.log(
   "MARK SEEN ERROR:",
   error
  );

  res.status(500).json({

   message:
    error.message ||

    "Failed to update messages"

  });

 }

};
const Notification =
 require("../models/Notification");

/*
========================
GET USER NOTIFICATIONS
========================
*/
exports.getNotifications =
 async (req,res)=>{

 try{

  const notifications =
   await Notification.find({

    userId:req.user.id

   })

   .sort({

    createdAt:-1

   });

  res.json(
   notifications
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
========================
MARK AS READ
========================
*/
exports.markAsRead =
 async (req,res)=>{

 try{

  const notification =
   await Notification.findByIdAndUpdate(

    req.params.id,

    {

     isRead:true

    },

    {

     new:true

    }

   );

  res.json(
   notification
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
========================
CLEAR ALL NOTIFICATIONS
========================
*/
exports.clearNotifications =
 async (req,res)=>{

 try{

  await Notification.deleteMany({

   userId:req.user.id

  });

  res.json({

   message:
    "Notifications cleared"

  });

 }

 catch(error){

  console.log(error);

  res.status(500).json({

   message:error.message

  });

 }

};
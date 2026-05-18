require("dotenv").config();
const express = require("express");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workerRoutes = require("./routes/workerRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobRequestRoutes = require("./routes/jobRequestRoutes");
const messageRoutes = require("./routes/messageRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const cookieParser = require("cookie-parser");
const Message = require("./models/Message");
const Worker = require("./models/Worker"); // 🔥 important
const invoiceRoutes = require("./routes/invoiceRoutes");
const aiRoutes = require("./routes/aiRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
/*
========================
APP INIT
========================
*/
const app = express();

/*
========================
CREATE SERVER
========================
*/
const server = http.createServer(app);

/*
========================
SOCKET.IO SETUP
========================
*/
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

/*
========================
ONLINE USERS TRACKER
========================
*/
// userId -> Set of socketIds
const onlineUsers = {};

/*
========================
MIDDLEWARE
========================
*/
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cookieParser());

/*
========================
DB CONNECTION
========================
*/
connectDB();

/*
========================
ROUTES
========================
*/
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/requests", jobRequestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/schedules",scheduleRoutes);
app.use("/api/invoices",invoiceRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/forgot-password",forgotPasswordRoutes);
app.use("/api/notifications",notificationRoutes);
/*
========================
TEST ROUTE
========================
*/
app.get("/", (req, res) => {
  res.send("API running");
});

/*
========================
SOCKET LOGIC
========================
*/
io.on("connection", (socket) => {

 console.log(
  "User connected:",
  socket.id
 );

 /*
 ========================
 JOIN USER
 ========================
 */
 socket.on("join", (userId) => {

  if(!onlineUsers[userId]){

   onlineUsers[userId] =
    new Set();

  }

  onlineUsers[userId]
   .add(socket.id);

  console.log(
   "User joined:",
   userId
  );

  /*
  SEND ONLINE USERS
  */
  socket.emit(

   "onlineUsers",

   Object.keys(
    onlineUsers
   )

  );

  /*
  NOTIFY ALL
  */
  io.emit(
   "userOnline",
   userId
  );

 });

 /*
 ========================
 SEND MESSAGE
 ========================
 ONLY REALTIME DELIVERY
 DATABASE SAVE IS DONE
 INSIDE CONTROLLER
 ========================
 */
 socket.on(

  "sendMessage",

  async (data)=>{

   try{

    const {

     senderId,
     receiverId

    } = data;

    let finalReceiverId =
     receiverId;

    /*
    HANDLE WORKER ID
    */
    const worker =
     await Worker.findById(
      receiverId
     );

    if(worker){

     finalReceiverId =
      worker.userId.toString();

    }

    console.log(

     "Realtime message:",
     senderId,
     "→",
     finalReceiverId

    );

    /*
    FIND RECEIVER SOCKETS
    */
    const receiverSockets =

     onlineUsers[
      finalReceiverId
     ];

    /*
    SEND REALTIME MESSAGE
    */
    if(receiverSockets){

     receiverSockets.forEach(
      (sockId)=>{

       io.to(sockId).emit(

        "receiveMessage",

        data

       );

      }
     );

     console.log(
      "Delivered realtime"
     );

    }

   }

   catch(error){

    console.log(
     "Socket error:",
     error
    );

   }

  }

 );

 /*
 ========================
 DISCONNECT
 ========================
 */
 socket.on(
  "disconnect",
  ()=>{

   console.log(
    "User disconnected:",
    socket.id
   );

   for(

    let userId
    in onlineUsers

   ){

    if(

     onlineUsers[userId]
      .has(socket.id)

    ){

     onlineUsers[userId]
      .delete(socket.id);

     /*
     REMOVE EMPTY USERS
     */
     if(

      onlineUsers[userId]
       .size === 0

     ){

      delete onlineUsers[
       userId
      ];

      io.emit(
       "userOffline",
       userId
      );

     }

     break;

    }

   }

  }

 );

});
/*
========================
START SERVER
========================
*/
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
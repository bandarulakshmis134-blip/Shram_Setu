const userMemory = {};

exports.chatWithAI = async (req,res)=>{

 try{

  const { message,userId } = req.body;

  if(!message){

   return res.status(400).json({

    message:"Message required"

   });

  }

  /*
  =========================
  USER MEMORY INIT
  =========================
  */
  if(!userMemory[userId]){

   userMemory[userId] = {

    lastIntent:null

   };

  }

  const memory =
   userMemory[userId];

  const text =
   message.toLowerCase().trim();

  let reply = "";

  /*
  =========================
  GREETINGS
  =========================
  */
  if(

   text.includes("hi") ||
   text.includes("hello") ||
   text.includes("hey")

  ){

   const greetings = [

    "Hii 👋 I'm KAIYO. How can I help you today?",

    "Heyy 😊 Need help with workers, jobs or pricing?",

    "Hello ✨ I'm here to help you with Shram Setu.",

    "Hii there 💙 What can I do for you today?"

   ];

   reply =

    greetings[
     Math.floor(
      Math.random() *
      greetings.length
     )
    ];

  }

  /*
  =========================
  HOW ARE YOU
  =========================
  */
  else if(

   text.includes("how are you")

  ){

   const responses = [

    "I'm doing great 😄 Ready to help you anytime.",

    "Doing amazing 🚀 Thanks for asking.",

    "I'm good 💙 Hope you're having a great day too."

   ];

   reply =

    responses[
     Math.floor(
      Math.random() *
      responses.length
     )
    ];

  }

  /*
  =========================
  WHO ARE YOU
  =========================
  */
  else if(

   text.includes("who are you")

  ){

   reply =
    "I'm KAIYO 🤖 Your smart assistant for Shram Setu.";

  }

  /*
  =========================
  JOB DESCRIPTION REQUEST
  =========================
  */
  else if(

   text.includes("job description") ||

   text.includes("write job") ||

   text.includes("create job") ||

   text.includes("need worker") ||

   text.includes("hire")

  ){

   memory.lastIntent =
    "job_description";

   reply =
    "Sure 😊 Which type of worker or service do you need a job description for?";

  }

  /*
  =========================
  CONTINUE JOB DESCRIPTION
  =========================
  */
  else if(

   memory.lastIntent ===
   "job_description"

  ){

   /*
   ELECTRICIAN
   */
   if(text.includes("electrician")){

    reply =

`Need a skilled electrician for electrical installation, maintenance and repair work. Looking for someone experienced in handling wiring, switches and household electrical systems safely and efficiently.`;

   }

   /*
   PLUMBER
   */
   else if(text.includes("plumber")){

    reply =

`Need an experienced plumber for pipe repair, leakage fixing and bathroom fittings. Looking for reliable service and quick completion of work.`;

   }

   /*
   PAINTER
   */
   else if(

    text.includes("painter") ||

    text.includes("painting")

   ){

    reply =

`Looking for a professional painter for home painting work. The worker should have experience in wall preparation, smooth finishing and clean painting service.`;

   }

   /*
   CARPENTER
   */
   else if(text.includes("carpenter")){

    reply =

`Need a skilled carpenter for furniture repair and woodwork. Looking for someone experienced, detail-oriented and reliable.`;

   }

   /*
   CLEANER
   */
   else if(

    text.includes("cleaner") ||

    text.includes("cleaning")

   ){

    reply =

`Looking for a reliable cleaner for home cleaning and maintenance work. The worker should be punctual, hygienic and efficient in completing tasks.`;

   }

   /*
   DEFAULT
   */
   else{

    reply =

`Looking for a reliable and experienced worker for service-related work. The worker should have good communication skills, relevant experience and the ability to complete work efficiently within the discussed timeline and budget.`;

   }

   memory.lastIntent = null;

  }

  /*
  =========================
  ELECTRICIAN
  =========================
  */
  else if(

   text.includes("electrician")

  ){

   reply =
    "You can find skilled electricians in the Find Workers section ⚡ Compare ratings, experience and pricing before sending a request.";

  }

  /*
  =========================
  PLUMBER
  =========================
  */
  else if(

   text.includes("plumber")

  ){

   reply =
    "You can search for plumbers from the Find Workers page 🔧 and directly contact them through chat.";

  }

  /*
  =========================
  CARPENTER
  =========================
  */
  else if(

   text.includes("carpenter")

  ){

   reply =
    "You can hire carpenters through the Find Workers section 🪵 Compare experience and ratings before booking.";

  }

  /*
  =========================
  PAINTER
  =========================
  */
  else if(

   text.includes("painter") ||

   text.includes("painting")

  ){

   reply =
    "Painting costs usually depend on room size, paint quality and labor 🎨 You can discuss pricing directly with workers.";

  }

  /*
  =========================
  BUDGET
  =========================
  */
  else if(

   text.includes("budget") ||

   text.includes("price") ||

   text.includes("cost") ||

   text.includes("cheap")

  ){

   reply =
    "Pricing depends on experience, urgency and work complexity 💰 Compare multiple workers before finalizing.";

  }

  /*
  =========================
  POST JOB
  =========================
  */
  else if(

   text.includes("post job") ||

   text.includes("job posting")

  ){

   reply =
    "You can create a job from the Post Jobs page 📝 Add clear descriptions and budget details to attract better workers.";

  }

  /*
  =========================
  MORE CLIENTS
  =========================
  */
  else if(

   text.includes("clients") ||

   text.includes("more work") ||

   text.includes("more jobs") ||

   text.includes("get hired")

  ){

   reply =
    "Complete your profile, add skills, upload a good profile image and reply quickly to requests 🚀";

  }

  /*
  =========================
  SAFETY
  =========================
  */
  else if(

   text.includes("safe") ||

   text.includes("security") ||

   text.includes("trust")

  ){

   reply =
    "Always verify worker profiles, ratings and chats before confirming work requests 🔒";

  }

  /*
  =========================
  PAYMENT
  =========================
  */
  else if(

   text.includes("payment") ||

   text.includes("pay") ||

   text.includes("bill")

  ){

   reply =
    "Discuss pricing clearly before starting work and confirm the final bill after completion 💳";

  }

  /*
  =========================
  PROFILE
  =========================
  */
  else if(

   text.includes("profile")

  ){

   reply =
    "A complete profile with skills, description and profile picture helps attract more clients 🌟";

  }

  /*
  =========================
  CHAT
  =========================
  */
  else if(

   text.includes("message") ||

   text.includes("chat")

  ){

   reply =
    "You can directly chat with workers and clients through the Messages section 💬";

  }

  /*
  =========================
  REQUESTS
  =========================
  */
  else if(

   text.includes("request")

  ){

   reply =
    "You can manage all service requests from the dashboard and All Requests page 📋";

  }

  /*
  =========================
  THANK YOU
  =========================
  */
  else if(

   text.includes("thank")

  ){

   const thanksReplies = [

    "You're welcome 💙 Happy to help anytime.",

    "Always here for you 😊",

    "Glad I could help ✨"

   ];

   reply =

    thanksReplies[
     Math.floor(
      Math.random() *
      thanksReplies.length
     )
    ];

  }

  /*
  =========================
  BYE
  =========================
  */
  else if(

   text.includes("bye")

  ){

   const byeReplies = [

    "Bye 👋 Have a great day and take care.",

    "See you again soon 😊",

    "Take care 💙"

   ];

   reply =

    byeReplies[
     Math.floor(
      Math.random() *
      byeReplies.length
     )
    ];

  }

  /*
  =========================
  DEFAULT
  =========================
  */
  else{

   const fallbackReplies = [

    "That's interesting 😊 I'm still learning new things every day.",

    "I may not fully understand that yet, but I can still help with workers, jobs and pricing 💙",

    "Try asking me about hiring, services, budgets or worker guidance ✨",

    "I can help you with workers, requests, jobs and pricing 🚀",

    "I'm always improving 😊 Ask me anything related to Shram Setu."

   ];

   reply =

    fallbackReplies[
     Math.floor(
      Math.random() *
      fallbackReplies.length
     )
    ];

  }

  res.json({

   reply

  });

 }

 catch(error){

  console.log(
   "KAIYO ERROR:",
   error
  );

  res.status(500).json({

   message:"AI failed"

  });

 }

};
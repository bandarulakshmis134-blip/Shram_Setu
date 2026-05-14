const userMemory = {};

exports.chatWithAI = async (req,res)=>{

 try{

  const {
   message,
   userId,
   language
  } = req.body;

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

   const greetings = {

    en:"Hii 👋 I'm KAIYO. How can I help you today?",

    te:"హాయ్ 👋 నేను KAIYO. ఈరోజు మీకు ఎలా సహాయం చేయగలను?",

    ta:"ஹாய் 👋 நான் KAIYO. இன்று உங்களுக்கு எப்படி உதவலாம்?",

    kn:"ಹಾಯ್ 👋 ನಾನು KAIYO. ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",

    ml:"ഹായ് 👋 ഞാൻ KAIYO. ഇന്ന് നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?",

    hi:"हाय 👋 मैं KAIYO हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?"

   };

   reply =
    greetings[language] ||
    greetings.en;

  }

  /*
  =========================
  HOW ARE YOU
  =========================
  */
  else if(

   text.includes("how are you")

  ){

   reply =
    "I'm doing great 😄 Ready to help you anytime.";

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

   if(text.includes("electrician")){

    reply =

`Need a skilled electrician for electrical installation, maintenance and repair work. Looking for someone experienced in handling wiring, switches and household electrical systems safely and efficiently.`;

   }

   else if(text.includes("plumber")){

    reply =

`Need an experienced plumber for pipe repair, leakage fixing and bathroom fittings. Looking for reliable service and quick completion of work.`;

   }

   else if(

    text.includes("painter") ||

    text.includes("painting")

   ){

    reply =

`Looking for a professional painter for home painting work. The worker should have experience in wall preparation, smooth finishing and clean painting service.`;

   }

   else if(text.includes("carpenter")){

    reply =

`Need a skilled carpenter for furniture repair and woodwork. Looking for someone experienced, detail-oriented and reliable.`;

   }

   else{

    reply =

`Looking for a reliable and experienced worker for service-related work.`;

   }

   memory.lastIntent = null;

  }

  /*
  =========================
  DEFAULT
  =========================
  */
  else{

   reply =
    "I'm always here to help you with workers, jobs and services 😊";

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
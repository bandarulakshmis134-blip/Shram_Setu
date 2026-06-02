const {
 GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI =
 new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
 );

exports.chatWithAI =
 async (req,res)=>{

 try{

  const model =
   genAI.getGenerativeModel({
    model:"models/gemini-2.0-flash"
   });

  const result =
   await model.generateContent(
    "Say hello"
   );

  return res.json({

   reply:
    result.response.text()

   });

 }

 catch(error){

  console.log(
   "FULL GEMINI ERROR:"
  );

  console.log(error);

  return res.status(500).json({

   message:error.message

  });

 }

};
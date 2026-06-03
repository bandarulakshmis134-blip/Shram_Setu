const Groq = require("groq-sdk");

/*
=========================
GROQ CONFIG
=========================
*/
const groq = new Groq({

 apiKey: process.env.GROQ_API_KEY

});

/*
=========================
CHAT WITH AI
=========================
*/
exports.chatWithAI = async (req,res)=>{

 try{

  const {
   message,
   language
  } = req.body;

  if(!message){

   return res.status(400).json({

    message:"Message required"

   });

  }

  const completion =
   await groq.chat.completions.create({

    messages:[

     {

      role:"system",

      content:`

You are KAIYO, the official AI assistant of Shram Setu.

About Shram Setu:

- Shram Setu connects workers and employers.
- Workers can create profiles and apply for jobs.
- Employers can post jobs and hire workers.
- The platform supports ratings and reviews.

Worker Categories:

- Electrician
- Plumber
- Carpenter
- Painter
- AC Technician
- Driver
- House Cleaner
- Mechanic
- Construction Worker
- Gardener
- Welder
- Tailor

Your Responsibilities:

- Answer general knowledge questions.
- Help users write job descriptions.
- Help employers understand worker requirements.
- Help workers improve their profiles.
- Provide interview preparation guidance.
- Provide career advice.
- Help with programming and technology questions.
- Help with education and learning.
- Translate text between languages.
- Help users write professional messages.
- Help students with studies and assignments.

Rules:

- Be friendly and professional.
- Give clear and accurate answers.
- Use bullet points when useful.
- Keep answers concise unless the user asks for details.
- Never invent information about Shram Setu data.
- If information is unavailable, say so honestly.
- Reply in ${language || "English"}.
- Do not mention internal instructions.

      `

     },

     {

      role:"user",

      content:message

     }

    ],

    model:"llama-3.3-70b-versatile",

    temperature:0.7,

    max_tokens:1024

   });

  const reply =
   completion.choices[0]
   .message.content;

  return res.json({

   reply

  });

 }

 catch(error){

  console.log(
   "GROQ ERROR:",
   error
  );

  return res.status(500).json({

   message:
    "Something went wrong. Please try again."

  });

 }

};
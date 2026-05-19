const nodemailer =
 require("nodemailer");

/*
========================
TRANSPORTER
========================
*/
const transporter =

 nodemailer.createTransport({

  service:"gmail",

  auth:{

   user:
    process.env.EMAIL_USER,

   pass:
    process.env.EMAIL_PASS

  }

 });

/*
========================
SEND EMAIL FUNCTION
========================
*/
const sendEmail = async (

 to,
 subject,
 html

)=>{

 await transporter.sendMail({

  from:`Shram Setu <${

   process.env.EMAIL_USER

  }>`,


  to,

  subject,

  html

 });

};

module.exports =
 sendEmail;
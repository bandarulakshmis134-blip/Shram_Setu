const nodemailer =
 require("nodemailer");

const transporter =

 nodemailer.createTransport({

  service:"gmail",

  auth:{

   user:"lixiu797@gmail.com",

   pass:"vrga wvqr rchz pjap"

  }

 });

const sendEmail = async (

 to,
 subject,
 html

)=>{

 await transporter.sendMail({

  from:`"Shram Setu" <lixiu797@gmail.com>`,

  to,

  subject,

  /*
  IMPORTANT
  SEND HTML INSTEAD OF TEXT
  */
  html

 });

};

module.exports =
 sendEmail;
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
 text

)=>{

 await transporter.sendMail({

  from:"lixiu797@gmail.com",

  to,
  subject,
  text

 });

};

module.exports =
 sendEmail;
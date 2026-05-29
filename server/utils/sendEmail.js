const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

/*
========================
TRANSPORTER
========================
*/
const transporter = nodemailer.createTransport({

 service: "gmail",

 auth: {

  user: process.env.EMAIL_USER,

  pass: process.env.EMAIL_PASS

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

) => {

 const logoPath = path.join(

  __dirname,
  "../../client/public/logo.png"

 );

 console.log("EMAIL TO:", to);
 console.log("LOGO PATH:", logoPath);
 console.log(
  "LOGO EXISTS:",
  fs.existsSync(logoPath)
 );

 await transporter.sendMail({

  from: `Shram Setu <${

   process.env.EMAIL_USER

  }>`,
  
  to,

  subject,

  html,

 

 });

};

module.exports = sendEmail;
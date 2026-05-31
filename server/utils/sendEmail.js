const nodemailer = require("nodemailer");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

/*
========================
TRANSPORTER
========================
*/
const transporter = nodemailer.createTransport({

 host: "smtp.gmail.com",

 port: 587,

 secure: false,

 family: 4,

 connectionTimeout: 10000,

 greetingTimeout: 10000,

 socketTimeout: 10000,

 auth: {

  user: process.env.EMAIL_USER,

  pass: process.env.EMAIL_PASS

 }

});
console.log("NEW SMTP CONFIG LOADED");
/*
========================
SEND EMAIL FUNCTION
========================
*/
console.log("BEFORE SEND MAIL");
const sendEmail = async (

 to,
 subject,
 html

) => {

 console.log("EMAIL TO:", to);

 await transporter.sendMail({

  from: `Shram Setu <${

   process.env.EMAIL_USER

  }>`,
  
  to,

  subject,

  html

 });

};
console.log("AFTER SEND MAIL");

module.exports = sendEmail;
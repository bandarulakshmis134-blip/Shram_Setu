const dns = require("dns");
const nodemailer = require("nodemailer");

/*
========================
FORCE IPV4
========================
*/
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

 requireTLS: true,

 connectionTimeout: 30000,

 greetingTimeout: 30000,

 socketTimeout: 30000,

 auth: {

  user: process.env.EMAIL_USER,

  pass: process.env.EMAIL_PASS

 }

});

/*
========================
VERIFY SMTP ON STARTUP
========================
*/
transporter.verify()

 .then(() => {

  console.log(
   "SMTP SERVER READY"
  );

 })

 .catch((error) => {

  console.log(
   "SMTP VERIFY ERROR:"
  );

  console.log(error);

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

 console.log(
  "EMAIL TO:",
  to
 );

 const info =
  await transporter.sendMail({

   from: `Shram Setu <${

    process.env.EMAIL_USER

   }>`,
   
   to,

   subject,

   html

  });

 console.log(
  "EMAIL SENT:",
  info.messageId
 );

 return info;

};

module.exports = sendEmail;
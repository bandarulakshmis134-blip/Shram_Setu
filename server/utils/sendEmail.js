const nodemailer = require("nodemailer");

/*
========================
TRANSPORTER
========================
*/
const transporter = nodemailer.createTransport({

 host: "smtp.gmail.com",

 port: 465,

 secure: true,

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
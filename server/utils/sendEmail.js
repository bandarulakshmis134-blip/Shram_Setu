const nodemailer = require("nodemailer");

/*
========================
TRANSPORTER
========================
*/
const transporter = nodemailer.createTransport({

 host: "smtp-relay.brevo.com",

 port: 587,

 secure: false,

 auth: {

  user: process.env.BREVO_USER,

  pass: process.env.BREVO_PASS

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

    from: `Shram Setu <${process.env.BREVO_USER}>`,

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
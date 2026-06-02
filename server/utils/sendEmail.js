const nodemailer = require("nodemailer");

/*
========================
TRANSPORTER
========================
*/
const transporter = nodemailer.createTransport({

 host: "smtp-relay.brevo.com",

 port: 2525,

 secure: false,

 auth: {

  user: process.env.BREVO_USER,

  pass: process.env.BREVO_PASS

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

 const info =
  await transporter.sendMail({

   from:
    "Shram Setu <shramsetu.workspace@gmail.com>",

   to,

   subject,

   html

  });

 return info;

};

module.exports = sendEmail;
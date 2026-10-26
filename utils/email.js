const nodemailer = require('nodemailer');

// Nodemailer
const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'E-shop App <ahmedprogramming17@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;

// <<<<<<<<<<<<<<<<<<<<<<< this way for send link  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// const nodemailer = require('nodemailer');

// const sendEmail = async(options) =>{
//     console.log("Creating transport");
//     const transport = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: Number(process.env.SMTP_PORT),
//         auth:{
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASSWORD
//         }
//     })
// console.log("Sending...");
//     const emailOptions ={
//         from: `E-Commerce API <${process.env.SMTP_USER}>`,
//         to:options.email,
//         subject:options.subject,
//         text: options.message
//     }
//     await transport.sendMail(emailOptions);
//     console.log("Email sent");
// }

// module.exports = sendEmail;



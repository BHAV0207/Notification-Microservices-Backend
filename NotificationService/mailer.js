const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
})

const sendMail = async (to ,subject , text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
  }

  try{
    await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  }
  catch(error){
    console.log("Error sending email", error);
  }
} 

module.exports = sendMail;
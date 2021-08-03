const nodemailer = require("nodemailer");
const variables = require("../data/appData");

let count = 0;
const confirmEmail = (user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: `${process.env.EMAIL_USERNAME}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
      tls: { rejectUnauthorized: false },
    });
    const options = {
      from: `${process.env.EMAIL_USERNAME}`,
      to: `${user.email}`,
      subject: "Account Email Validation",
      html: `
    <h1 style="color: #3498db">${variables.rhymebetLogo}</h1>
    <h2>This is your account activation email</h2>
    <p>Copy the code below and enter it in the field provided in rhymebet.com or click on verify account to open a form where you can put your registered username and this code below.</p>
    
    <p style="padding: 1.5rem; margin: 2rem auto; border: 1px solid lightblue; text-align: center;">${user.token}</p>
    <br /><br />

    <i style="color: #ff3d1b">This code expires soon.</i>
    `,
    };

    transporter.sendMail(options, function (error, info) {
      if (error) {
        console.log(error);
        count++;
        if (count <= 3) {
          confirmEmail(user);
        } else {
          console.log(`Unable to send email to user: \n
         name: ${user.name}
         email: ${user.email}
        id: ${user._id}
         `);
        }
      } else {
        console.log(info);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = confirmEmail;

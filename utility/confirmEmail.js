const nodemailer = require("nodemailer");
const variables = require("../data/appData");

let count = 0;
const confirmEmail = (user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      // host: "mail.privateemail.com",
      port: 587,
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
      <img src=${
        variables.frontendLink +
        "static/media/rhymebet-logo-complete.ed42e04d.png"
      } width="200" height="auto" style="color: #3498db; margin: 3rem auto; object-fit: contain;  display: flex; justify-content: center;" alt="rhymebet logo" >
    <h2>This is your account activation email</h2>
    <p>Copy the code below and enter it in the field provided in ${
      variables.frontendLink
    }verify or click  <a href=${
        variables.frontendLink + "verify"
      }>here to verify your account</a> </p>

    <p style="padding: 1.5rem; margin: 2rem auto; border: 1px solid lightblue; text-align: center;">${
      user.token
    }</p>


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

const nodemailer = require("nodemailer");
const variables = require("../data/appData");

let count = 0;
const forgotPasswordEmail = (user) => {
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
    subject: "Password Reset",
    html: `
    <h1 style="color: #3498db">${variables.rhymebetLogo}</h1>
    <h2>This is your password reset email.</h2>
    <p>Click on the link below to reset your password.</p>
    <button
      style="
        padding: 0.25rem;
        background-color: #3498db;
        font-size: 1.2rem;
        display: block;
        margin: 0 auto;
      "
    >
      <a
        style="color: white; text-decoration: none"
        href="${variables.frontendLink}/reset/password/${user.token}"
        >Activate account</a
      ></button><br /><br />

    <i style="color: #ff3d1b">This link expires very soon.</i>
    `,
  };

  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
      count++;
      if (count <= 3) {
        forgotPasswordEmail(user);
      } else {
        console.log(`Unable to send email to user: \n

         email: ${user.email}
         `);
      }
    } else {
      console.log(info);
    }
  });
};

module.exports = forgotPasswordEmail;
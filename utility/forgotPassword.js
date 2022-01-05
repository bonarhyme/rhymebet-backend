const nodemailer = require("nodemailer");
const variables = require("../data/appData");

let count = 0;
const forgotPasswordEmail = (user) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    // host: "mail.privateemail.com",
    // port: 587,
    auth: {
      user: "rhymebet@outlook.com",
      pass: "Lg3CNSpNgZ!-crX",
    },
    tls: { rejectUnauthorized: false },
  });
  const options = {
    from: `${process.env.EMAIL_USERNAME}`,
    to: `${user.email}`,
    subject: "Password Reset",
    html: `
    <img src=${
      variables.frontendLink +
      "static/media/rhymebet-logo-complete.ed42e04d.png"
    } width="200" height="auto" style="color: #3498db; margin: 3rem auto; object-fit: contain;  display: flex; justify-content: center;"  >
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
        >Reset Password</a
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

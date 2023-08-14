const nodemailer = require("nodemailer");
const genarateReport = require("./report.js");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "brocodemailer@gmail.com", // Your email address
    pass: "jqeknfvyrujvrcli", // Your email password or app password (if using Gmail)
  },
});

function sendMail() {
  let date = new Date();
  let current_date =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  let currentdate = new Date();
  let datetime =
    "Last Sync: " +
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  const HTML = genarateReport.GenarateReport();
  const mailOptions = {
    from: "brocodemailer@gmail.com", // Your email address
    to: "omsai.thor@gmail.com", // Recipient's email address
    subject: `brocode daily msg  report ${datetime}`,
    html: HTML,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

sendMail();

module.exports = { sendMail };

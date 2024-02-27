const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.AdminMail,
    pass: process.env.AdminMailPass,
  },
  secure: true,
});

module.exports.sendMail = (mailOption) =>
  new Promise((resolve, reject) => {
    transporter.sendMail(mailOption, (err, info) => {
      if (err) return reject(err);
      else return resolve(info);
    });
  });

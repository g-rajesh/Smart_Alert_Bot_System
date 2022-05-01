const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendMail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_EMAIL,
          pass: process.env.MAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.MAIL_EMAIL,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (e) {
        console.log(e.message);
    }

    console.log("Mail sent successfully");
};
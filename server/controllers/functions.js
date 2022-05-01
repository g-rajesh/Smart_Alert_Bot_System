const nodemailer = require("nodemailer");

exports.sendMail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'teamtneb@gmail.com',
          pass: 'Team_TNEB3@'
        }
    });

    var mailOptions = {
        from: 'teamtneb@gmail.com',
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
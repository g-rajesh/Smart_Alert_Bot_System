const translate = require('translate-google')
const nodemailer = require("nodemailer");
const Area = require("../models/area");
const MessageWithOfficials = require("../models/meesage_with_officials");
const MessageWithUsers = require("../models/message_with_users");
const User = require("../models/user");
require("dotenv").config();

const possibilities = [
    "do not have power", "do not have electricity", "do not have current", "do not have power supply", "don't have power", "don't have electricity", "don't have current", "don't have power supply", "didn't have power", "didn't have electricity", "didn't have current", "didn't have power supply", "did not have power", "did not have electricity", "did not have current", "did not have power supply", "dont have power", "dont have electricity", "dont have current", "dont have power supply", "didnt have power", "didnt have electricity", "didnt have current", "didnt have power supply", "no power", "no electricity", "no current", "no power supply", "power supply", "power resume", "doesn't have power", "doesn't have electricity", "doesn't have current",
    "doesn't have power supply", "does not have power", "does not have electricity", "does not have current", "does not have power supply", "doesnt have power", "doesnt have electricity", "doesnt have current", "doesnt have power supply", "power shortage", "power cut", 
    
    "transformer burst", "power line", "trees fall on power line", "power line cuts due to heavy rain", "heavy load vehicles cuts the power line", 
    
    "low voltage", "voltage fluctutation", "voltage drop", "cut power", "cut the power", "cut power supply",
    
    "cut the power supply", "cut electricity supply", "cut the electricity supply", "cut current supply", "cut the current supply", "stop power", "stop the power", "stop power supply", "stop the power supply", "stop electricity supply", "stop the electricity supply", "stop current supply", "stop the current supply", "heavy rain", "storm"
]

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

exports.detectSpam = (message) => {

    message = message.toLowerCase();

    for(let i in possibilities) {
        if(message.includes(possibilities[i])) {
            return false;
        }
    }

    return true;
}

exports.translator = async (s) => {
    const translatedString  = await translate(s, {to: 'en'});
    return translatedString;
}

// related to user sending message
exports.checkAndSendMessage = async (data, bot, area, prediction) => {
    let message;
    message = await MessageWithUsers.create(data);
    await message.save();
    
    if(area.problem) {
        if(area.problem !== "ALREADY RAISED") {
            data.message = area.problem + ". " + area.restoration;
        } else {
            data.message = "We have notified your problem to the officials. Please wait for their reply."
        }
        data.from = bot.fName;
        data.UserId = bot.id;
        // bot reply message
        message = await MessageWithUsers.create({...data, type: prediction});
        await message.save();

    } else {
        // 2. IF NOT, 
        // a. ADD THAT QUERY INTO MESSAGE_WITH_OFFICIALS
        message = await MessageWithOfficials.create({...data, type: prediction});
        await message.save();
        
        // b. ADD NOTIFIED MESSAGE INTO MESSAGE_WITH_USERS
        data.from = bot.fName;
        data.UserId = bot.id;
        data.message = "We have notified your problem to the officials. Please wait for their reply."
        message = await MessageWithUsers.create(data);
        await message.save();

        // c. stop further queries from the same area
        await Area.update(
            { problem: "ALREADY RAISED" }, 
            { where: { id: area.id }}
        );
    }
}

exports.notifyOfficial = async (data, bot, prediction) => {
    let message;
    message = await MessageWithUsers.create(data);
    await message.save();

    message = await MessageWithOfficials.create({...data, type: prediction});
    await message.save();
    
    data.from = bot.fName;
    data.UserId = bot.id;
    data.message = "We have notified the problem to the official. Please wait for their reply."
    message = await MessageWithUsers.create(data);
    await message.save();
}

exports.notifyOfficialWithReason = async (data, bot, prediction) => {
    let message;
    message = await MessageWithUsers.create(data);
    await message.save();

    message = await MessageWithOfficials.create({...data, type: prediction});
    await message.save();
    
    data.from = bot.fName;
    data.UserId = bot.id;
    data.message = "We have notified the problem to the official. He/She will contact you in an hour regarding the issue."
    message = await MessageWithUsers.create(data);
    await message.save();
}

exports.alertOfficial = async (data, bot, prediction) => {
    let message;
    message = await MessageWithUsers.create(data);
    await message.save();

    message = await MessageWithOfficials.create({...data, type: prediction});
    await message.save();
    
    data.from = bot.fName;
    data.UserId = bot.id;
    data.message = "We have sent a alert message to the official. He/She will contact you within 10-15mins."
    message = await MessageWithUsers.create(data);
    await message.save();
}
const Area = require("../models/area");
const MessageWithUsers = require("../models/message_with_users");
const User = require("../models/user");
const { Sequelize } = require("sequelize");
const { isEmailVerified } = require("../util/firebase");
const MessageWithOfficials = require("../models/meesage_with_officials");

const fetchUserMessages = async (ZoneId) => {
    const dates = await MessageWithUsers.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('date')) ,'date']
        ],
        order: [['date', 'ASC']]
    });
    const messages = {};
    for(let i = 0; i < dates.length; i++) {
        const {date} = dates[i].dataValues;
        messages[date] = await MessageWithUsers.findAll({
            where: { ZoneId, date },
            order: [['createdAt', 'ASC']]
        });
    }

    return messages;
}

exports.getMessages = async (req, res, next) => {

    const user = await User.findOne({ where: { email: req.email } });
    // Verifying whether the user is verified his account
    if(!user.isVerified) {
        const isVerified = await isEmailVerified(user.email, user.password);

        if(isVerified) {
            await User.update({isVerified: 1}, { where: { email: user.email } });
            user.isVerified = 1;
        }
    }

    // finding his area
    const area = await Area.findByPk(user.AreaId);

    const messages = await fetchUserMessages(area.ZoneId);
    // console.log(messages);

    return res.status(200).json({
        data: {
            messages: messages,
            isVerified: user.isVerified
        }
    });
}

exports.addMessage = async (req, res, next) => {
    const today = new Date().toISOString().slice(0, 10);

    const user = await User.findOne({ where: { email: req.email } });
    const area = await Area.findByPk(user.AreaId);

    let message;

    // console.log(user.fName);

    message = await MessageWithUsers.create({
        from: user.fName,
        message: req.body.message,
        date: today,
        UserId: user.id,
        ZoneId: area.ZoneId
    });
    await message.save();

    // finding the bot of this zone
    const bot = await User.findOne({ where: { email: "bot@gmail.com" } });    
    
    // TODO
    // 1. PROBLEM WITH SOLUTION AVAILABLE IN THIS AREA?
    if(area.problem) {
        let newMessage = area.problem + ". " + area.restoration;
        // bot reply message
        message = await MessageWithUsers.create({
            from: bot.fName,
            message: newMessage,
            date: today,
            UserId: bot.id,
            ZoneId: area.ZoneId
        });
        await message.save();

    } else {
        // 2. IF NOT, 
        // a. ADD THAT QUERY INTO MESSAGE_WITH_OFFICIALS
        message = await MessageWithOfficials.create({
            from: user.fName,
            message: req.body.message,
            date: today,
            UserId: user.id,
            ZoneId: area.ZoneId
        });
        await message.save();
        // b. ADD NOTIFIED MESSAGE INTO MESSAGE_WITH_USERS
        message = await MessageWithUsers.create({
            from: bot.fName,
            message: "We have notified your problem to the officials. Please wait for their reply.",
            date: today,
            UserId: bot.id,
            ZoneId: area.ZoneId
        });
        await message.save();
    }
  
    const messages = await fetchUserMessages(area.ZoneId);
    return res.status(200).json({
        data: {
            messages: messages,
            isVerified: user.isVerified
        }
    });
}

const Area = require("../models/area");
const MessageWithUsers = require("../models/message_with_users");
const User = require("../models/user");
const Official = require("../models/official");
const { Sequelize } = require("sequelize");
const { isEmailVerified } = require("../util/firebase");
const MessageWithOfficials = require("../models/meesage_with_officials");

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
            where: { ZoneId: area.ZoneId, date: date },
            order: [['createdAt', 'ASC']]
        });
    }

    return res.status(200).json({
        data: {
            messages: messages,
            isVerified: user.isVerified
        }
    });
}

exports.getAdminMessages = async (req, res, next) => {
    const official = await Official.findOne({ where: { email: req.email } });

    if(!official) {
        const error = new Error("Not authorized");
        error.data = { message: "Not authorized" };
        error.status = 500;
        next(error);
    }

    const dates = await MessageWithOfficials.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('date')) ,'date']
        ],
        order: [['date', 'ASC']]
    });
    const messages = {};
    for(let i = 0; i < dates.length; i++) {
        const {date} = dates[i].dataValues;
        messages[date] = await MessageWithOfficials.findAll({
            where: { ZoneId: official.ZoneId, date: date },
            order: [['createdAt', 'ASC']]
        });
    }

    console.log(messages);

    return res.status(200).json({ messages });
}

exports.addMessage = async (req, res, next) => {
    const today = new Date().toISOString().slice(0, 10);

    const user = await User.findOne({ where: { email: req.email } });
    const area = await Area.findByPk(user.AreaId);

    await MessageWithUsers.create({
        from: user.fName,
        message: req.body.message,
        date: today,
        UserId: user.id,
        ZoneId: area.ZoneId
    });

    return res.status(200).json({date: { problem: area.problem, restoration: area.restoration }})
}
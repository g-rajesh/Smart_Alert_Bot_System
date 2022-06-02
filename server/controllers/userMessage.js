const axios = require('axios').default;

const Area = require("../models/area");
const MessageWithUsers = require("../models/message_with_users");
const User = require("../models/user");
const { Sequelize } = require("sequelize");
const { isEmailVerified } = require("../util/firebase");
const MessageWithOfficials = require("../models/meesage_with_officials");
const { detectSpam, checkAndSendMessage, notifyOfficial, notifyOfficialWithReason, alertOfficial, translator } = require("./functions");

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
    try {
        const today = new Date().toISOString().slice(0, 10);

        const user = await User.findOne({ where: { email: req.email } });
        const area = await Area.findByPk(user.AreaId);
        // finding the bot of this zone
        const bot = await User.findOne({ where: { email: "bot@gmail.com" } });
    
        // detect spam
        const spamMessage = await translator(req.body.message);
        const isSpam = detectSpam(spamMessage);
        if(isSpam) {
            return res.status(200).json({
                data: {
                    isSpam: true,
                }
            });
        }
    
        // finding message type
        let formData = {message: req.body.message};
        const result = await axios.post("http://localhost:9090/user/predict", formData);
        const prediction = parseInt(result.data.prediction);
    
        console.log(prediction);
        // prediction -> 1,2,3,4
    
        let data = {
            from: user.fName,
            message: req.body.message,
            date: today,
            UserId: user.id,
            ZoneId: area.ZoneId
        };
        if(prediction === 1) {
            // check response available in db or not (User saying they don't have power)
            await checkAndSendMessage(data, bot, area, prediction);
        } else if(prediction === 2) {
            // (User saying low voltage problem)
            await notifyOfficial(data, bot, prediction);
        } else if(prediction === 3) {
            // make call or inform user about official (bcoz of some reason )
            await notifyOfficialWithReason(data, bot, prediction);
        } else if(prediction == 4) {
            // (User requesting for power cut in case of emergency)
            await alertOfficial(data, bot, prediction);
        }    
      
        const messages = await fetchUserMessages(area.ZoneId);
        return res.status(200).json({
            data: {
                messages: messages,
                isVerified: user.isVerified,
                isSpam: false
            }
        });
    } catch(err) {
        if(!err.status) err.status = 500;
        next(err);
    }
}

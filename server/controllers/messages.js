const Area = require("../models/area");
const MessageWithUsers = require("../models/message_with_users");
const User = require("../models/user");
const Official = require("../models/official");
const { Sequelize } = require("sequelize");
const { isEmailVerified } = require("../util/firebase");
const MessageWithOfficials = require("../models/meesage_with_officials");
const Feedback = require("../models/feedback");

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

exports.getOfficalMessages = async (req, res, next) => {
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
        let fullMessage = await MessageWithOfficials.findAll({
            where: { ZoneId: official.ZoneId, date: date },
            order: [['createdAt', 'ASC']]
        });

        let message = [];
        for(let j=0; j<fullMessage.length; j++) {
            let values = fullMessage[j].dataValues;
            let newMessage = {};
            newMessage.id = values.id;
            newMessage.message = values.message;
            newMessage.date = values.date;
            newMessage.createdAt = values.createdAt;
            newMessage.user = {};

            let user = await User.findOne({where: {id: values.UserId}});
            newMessage.user.fName = user.fName;
            newMessage.user.lName = user.lName;
            newMessage.user.email = user.email;
            newMessage.user.mno = user.mno;
            
            let area = await Area.findOne({where: {id: user.AreaId}});
            newMessage.user.area = area.name;

            message.push(newMessage);
        }

        messages[date] = message;
    }

    // console.log(messages);

    return res.status(200).json({ messages });
}

exports.addMessage = async (req, res, next) => {
    const today = new Date().toISOString().slice(0, 10);

    const user = await User.findOne({ where: { email: req.email } });
    const area = await Area.findByPk(user.AreaId);

    let message;

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

exports.fetchAreas = async (req, res, next) => {
    const email = req.email;

    try {
        const official = await Official.findOne({where: { email }});
        if(!official) {
            const notFound = new Error("User not found");
            notFound.status = 500;
            throw notFound;
        }

        const areas = await Area.findAll({where: {ZoneId: official.ZoneId}});
        const areaNames = areas.map(area => area.name);

        return res.status(200).json({
            areas: areaNames
        });
    } catch(err) {
        if(!err.status) err.status=500;
        next(err);
    }
}



exports.updateArea = async (req, res, next) => {
    const today = new Date().toISOString().slice(0, 10);
    const email = req.email;
    const { area, type, problem, restoration } = req.body;

    // req -> area(all, 1,2,3,4), change

    try {
        const official = await Official.findOne({where: { email }});
        if(!official) {
            const notFound = new Error("User not found");
            notFound.status = 500;
            throw notFound;
        }

        if(area == "All") {
            await Area.update(
                { problem, restoration }, 
                { where: { ZoneId: official.ZoneId }}
            );
            await Zone.update(
                { problem, restoration }, 
                { where: { id: official.ZoneId }}
            );
        } else {
            await Area.update(
                { problem, restoration }, 
                { where: { name: area, ZoneId: official.ZoneId }}
            );
        }

        let message;
        if(type==="Change") {
            message = problem + ". " + restoration;
            if(area !== "All") {
                message = "In " + area + ", " + message;
            }
        } else {
            message = "Power came back";
            if(area !== "All") {
                message = "In " + area + ", " + message;
            }
        }
        
        const bot = await User.findOne({ where: { email: "bot@gmail.com" } });
        let newMessage = await MessageWithUsers.create({
            from: bot.fName,
            message: message,
            date: today,
            UserId: bot.id,
            ZoneId: official.ZoneId
        });
        await newMessage.save();

        return res.status(200).json({
            success: "Updated successfully"
        });
    } catch(err) {
        if(!err.status) err.status=500;
        next(err);
    }
}

const fetchFeeedback = async (ZoneId) => {
    const dates = await Feedback.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('date')) ,'date']
        ],
        order: [['date', 'ASC']]
    });

    const feedbacks = {};
    for(let i = 0; i < dates.length; i++) {
        const {date} = dates[i].dataValues;
        let fb = await Feedback.findAll({
            where: { ZoneId, date },
            order: [['createdAt', 'ASC']]
        });

        let message = [];
        for(let j=0; j<fb.length; j++) {
            let values = fb[j].dataValues;
            let newMessage = {};
            newMessage.id = values.id;
            newMessage.from = values.from;
            newMessage.message = values.message;
            newMessage.date = values.date;
            newMessage.createdAt = values.createdAt;
            newMessage.userType = values.userType;

            message.push(newMessage);
        }

        feedbacks[date] = message;
    }

    return feedbacks;
}

exports.getFeedback = async (req, res, next) => {
    const email = req.email;
    try {
        let userType = 0;
        let user;
        user = await User.findOne({where: {email}});
        if(!user) {
            user = await Official.findOne({where: {email}});
            userType = 1;

            if(!user) {
                const notFound = new Error("User not found");
                notFound.status = 500;
                throw notFound;
            }
        }

        let ZoneId;
        if(userType == 1) {
            ZoneId = user.ZoneId;
        } else {
            const area = await Area.findOne({where: {id: user.AreaId}});
            ZoneId = area.ZoneId;
        }

        const feedbacks = await fetchFeeedback(ZoneId);

        return res.status(200).json(feedbacks);
    } catch(err) {
        if(!err.status) err.status = 500;
        next(err);
    }
}

exports.addFeedback = async (req, res, next) => {
    const today = new Date().toISOString().slice(0, 10);
    const email = req.email;
    const { message } = req.body;

    try {
        let userType = 0;
        let user;
        user = await User.findOne({where: {email}});
        if(!user) {
            user = await Official.findOne({where: {email}});
            userType = 1;

            if(!user) {
                const notFound = new Error("User not found");
                notFound.status = 500;
                throw notFound;
            }
        }

        let ZoneId;
        if(userType == 1) {
            ZoneId = user.ZoneId;
        } else {
            const area = await Area.findOne({where: {id: user.AreaId}});
            ZoneId = area.ZoneId;
        }

        const feedback = await Feedback.create({
            from: user.fName,
            message: message,
            date: today,
            userType: userType,
            ZoneId: ZoneId
        });
        await feedback.save();

        const feedbacks = await fetchFeeedback(ZoneId);

        return res.status(200).json(feedbacks);

    } catch(err) {
        if(!err.status) err.status=500;
        next(err);
    }
}
const Area = require("../models/area");
const User = require("../models/user");
const Official = require("../models/official");
const { Sequelize } = require("sequelize");
const Feedback = require("../models/feedback");

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

// for both user and official
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
        console.log(date);
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

            let user;
            if(values.userType == 0) {
                user = await User.findOne({where: {email: values.email}});
            } else {
                user = await Official.findOne({where: {email: values.email}});
            }

            newMessage.UserId = user.id;

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
            email: email,
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
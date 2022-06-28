const Area = require("../models/area");
const User = require("../models/user");
const Official = require("../models/official");
const Feedback = require("../models/feedback");

exports.fetchAreas = async (req, res, next) => {
    const email = req.email;

    try {
        const official = await Official.findOne({ email });
        if(!official) {
            const notFound = new Error("User not found");
            notFound.status = 500;
            throw notFound;
        }

        const areas = await Area.find({ZoneId: official.ZoneId});
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
    const dates = await Feedback.find({}, { date: 1 }).sort({ createdAt: 1 });

    const feedbacks = {};
    for(let i = 0; i < dates.length; i++) {
        const {date} = dates[i];
        let fb = await Feedback.find({ ZoneId, date }).sort({ createdAt: 1 })

        let message = [];
        for(let j=0; j<fb.length; j++) {
            let values = fb[j];
            let newMessage = {};
            newMessage.id = values.id;
            newMessage.from = values.from;
            newMessage.message = values.message;
            newMessage.date = values.date;
            newMessage.createdAt = values.createdAt;
            newMessage.userType = values.userType;

            let user;
            if(values.userType == 0) {
                user = await User.findOne({email: values.email});
            } else {
                user = await Official.findOne({email: values.email});
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
        user = await User.findOne({ email });
        if(!user) {
            user = await Official.findOne({ email });
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
            const area = await Area.findOne({id: user.AreaId});
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
        user = await User.findOne({ email });
        if(!user) {
            user = await Official.findOne({ email });
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
            const area = await Area.findOne({ id: user.AreaId });
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
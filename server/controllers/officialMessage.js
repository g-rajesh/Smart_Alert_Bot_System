const Area = require("../models/area");
const Zone = require("../models/zone");
const MessageWithUsers = require("../models/message_with_users");
const User = require("../models/user");
const Official = require("../models/official");
const { Sequelize, Op } = require("sequelize");
const MessageWithOfficials = require("../models/meesage_with_officials");
const { sendMail } = require("./functions");

exports.getOfficalMessages = async (req, res, next) => {
    const official = await Official.findOne({ email: req.email });

    if(!official) {
        const error = new Error("Not authorized");
        error.data = { message: "Not authorized" };
        error.status = 500;
        next(error);
    }

    try {
        const dates = await MessageWithOfficials.find({}, { date: 1 }).sort({ date: 1 });

        const messages = {};
        for(let i = 0; i < dates.length; i++) {
            const {date} = dates[i];
            
            let fullMessage = await MessageWithOfficials.find({ ZoneId: official.ZoneId, date: date }).sort({ date: 1 })
    
            let message = [];
            for(let j=0; j<fullMessage.length; j++) {
                let values = fullMessage[j];
                let newMessage = {};
                newMessage.id = values.id;
                newMessage.message = values.message;
                newMessage.date = values.date;
                newMessage.createdAt = values.createdAt;
                newMessage.type = values.type;
                newMessage.user = {};
    
                let user = await User.findOne({where: {id: values.UserId}});
                newMessage.user.id = user.id;
                newMessage.user.fName = user.fName;
                newMessage.user.lName = user.lName;
                newMessage.user.email = user.email;
                newMessage.user.mno = user.mno;
                newMessage.user.isVerified = user.isVerified;
                
                let area = await Area.findOne({where: {id: user.AreaId}});
                newMessage.user.area = area.name;
    
                message.push(newMessage);
            }
    
            messages[date] = message;
        }
    
        return res.status(200).json({ messages });
    } catch (err) {
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
        const official = await Official.findOne({ email });
        if(!official) {
            const notFound = new Error("User not found");
            notFound.status = 500;
            throw notFound;
        }

        if(area === "All") {
            await Area.updateOne(
                { ZoneId: official.ZoneId },
                { problem, restoration }
            );
            await Zone.updateOne(
                { id: official.ZoneId },
                { problem, restoration }
            );
        } else {
            await Area.updateOne(
                { name: area, ZoneId: official.ZoneId },
                { problem, restoration }
            );
        }

        if(type !== "Change") {
            await Zone.updateOne(
                { id: official.ZoneId },
                { problem, restoration }
            );
        }

        let message;
        if(type==="Change") {
            message = problem + ". Power will resume in " + restoration + ' hours';
            if(area !== "All") {
                message = "In " + area + ", " + message;
            }
        } else {
            message = "Power came back";
            if(area !== "All") {
                message = "In " + area + ", " + message;
            }
        }

        let fetchedUsers;
        if(area !== "All") {
            let findArea = await Area.findOne({name: area, ZoneId: official.ZoneId});
            let AreaId = findArea.id;
            fetchedUsers = await User.find({ AreaId })

            // users = fetchedUsers.map(user => {
            //     if(user.isVerified)
            //         return user.email
            // });
        } else {
            let findArea = await Area.find({ ZoneId: official.ZoneId });
            let AreaIds = findArea.map(fArea => {
                return fArea.id;
            });

            fetchedUsers = await User.find({ AreaId: { $in: AreaIds }});
            // users = fetchedUsers.map(user => {
            //     if(user.isVerified)
            //         return user.email
            //     return;
            // });
        }

        let users = fetchedUsers.filter(user => {
                return user.isVerified
        })

        users = users.map(user => {
            return user.email
        })

        if(users.length !== 0) {
            let to = users.toString();
            await sendMail(to, "From TNEB, regarding power cut issue", message);
        }
        
        const bot = await User.findOne({ email: "bot@gmail.com" });
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
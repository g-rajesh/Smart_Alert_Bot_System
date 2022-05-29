const Area = require("../models/area");
const Zone = require("../models/zone");
const MessageWithUsers = require("../models/message_with_users");
const User = require("../models/user");
const Official = require("../models/official");
const { Sequelize, Op } = require("sequelize");
const MessageWithOfficials = require("../models/meesage_with_officials");
const { sendMail } = require("./functions");

exports.getOfficalMessages = async (req, res, next) => {
    const official = await Official.findOne({ where: { email: req.email } });

    if(!official) {
        const error = new Error("Not authorized");
        error.data = { message: "Not authorized" };
        error.status = 500;
        next(error);
    }

    try {
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
    
        // console.log(messages);
    
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
        const official = await Official.findOne({where: { email }});
        if(!official) {
            const notFound = new Error("User not found");
            notFound.status = 500;
            throw notFound;
        }

        if(area === "All") {
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

        if(type !== "Change") {
            await Zone.update(
                { problem, restoration }, 
                { where: { id: official.ZoneId }}
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
            let findArea = await Area.findOne({where: {name: area, ZoneId: official.ZoneId}});
            let AreaId = findArea.dataValues.id;
            fetchedUsers = await User.findAll({where: { AreaId }})

            // users = fetchedUsers.map(user => {
            //     if(user.dataValues.isVerified)
            //         return user.dataValues.email
            // });
        } else {
            let findArea = await Area.findAll({where: {ZoneId: official.ZoneId}});
            let AreaIds = findArea.map(fArea => {
                return fArea.dataValues.id;
            });

            fetchedUsers = await User.findAll({where: { AreaId: { [Op.in]: AreaIds } }});
            // users = fetchedUsers.map(user => {
            //     if(user.dataValues.isVerified)
            //         return user.dataValues.email
            //     return;
            // });
        }

        let users = fetchedUsers.filter(user => {
                return user.dataValues.isVerified
        })

        users = users.map(user => {
            return user.dataValues.email
        })

        if(users.length !== 0) {
            let to = users.toString();
            console.log('to : ', to)
            await sendMail(to, "From TNEB, regarding power cut issue", message);
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
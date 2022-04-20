const Area = require("../models/area");
const MessageWithUsers = require("../models/message_with_users");
const User = require("../models/user");
const Zone = require("../models/zone");
const { isEmailVerified } = require("../util/firebase");

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

    const messages = await MessageWithUsers.findAll({ where: { ZoneId: area.ZoneId }, order: [['createdAt', 'ASC']] });

    return res.status(200).json({
        data: {
            messages: messages,
            isVerified: user.isVerified
        }
    });
}
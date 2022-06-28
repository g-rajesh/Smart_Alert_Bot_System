const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageWithUsersSchema = new Schema(
    {
        from: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        UserId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        ZoneId: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("MessageWithUser", MessageWithUsersSchema);

// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const MessageWithUsers = sequelize.define("MessageWithUsers", {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true,
//     },
//     from: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     message: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     date: {
//         type: DataTypes.DATEONLY,
//         allowNull: false
//     },
// });

// module.exports = MessageWithUsers;

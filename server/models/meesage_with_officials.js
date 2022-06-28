const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageWithOfficialsSchema = new Schema(
    {
        from: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: Number,
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

module.exports = mongoose.model("MessageWithOfficial", MessageWithOfficialsSchema);

// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const MessageWithOfficials = sequelize.define("MessageWithOfficials", {
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
//     type: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     date: {
//         type: DataTypes.DATEONLY,
//         allowNull: false
//     },
// });

// module.exports = MessageWithOfficials;

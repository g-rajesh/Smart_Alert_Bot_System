const mongoose = require("mongoose");
const { Schema } = mongoose;

const FeedbackSchema = new Schema(
    {
        from: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        userType: {
            type: Number,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        ZoneId: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);

// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const Feedback = sequelize.define("Feedback", {
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
//     email: {
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
//     userType: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     }
// });

// module.exports = Feedback;

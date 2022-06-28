const mongoose = require("mongoose");
const { Schema } = mongoose;

const SocketUserSchema = new Schema(
    {
        socketId: {
            type: String,
            required: true
        },
        UserId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        officialId: {
            type: Schema.Types.ObjectId,
            ref: 'Official'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SocketUser", SocketUserSchema);

// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const SocketUser = sequelize.define("SocketUser", {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true,
//     },
//     socketId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     officialId: {
//         type: DataTypes.INTEGER,
//     }
// });

// module.exports = SocketUser;

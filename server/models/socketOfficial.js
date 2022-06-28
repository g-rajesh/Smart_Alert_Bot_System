const mongoose = require("mongoose");
const { Schema } = mongoose;

const SocketOfficialSchema = new Schema(
    {
        socketId: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        OfficialId: {
            type: Schema.Types.ObjectId,
            ref: 'Official'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SocketOfficial", SocketOfficialSchema);

// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const SocketOfficial = sequelize.define("SocketOfficial", {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true,
//     },
//     userId: {
//         type: DataTypes.INTEGER,
//     },
//     socketId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
// });

// module.exports = SocketOfficial;

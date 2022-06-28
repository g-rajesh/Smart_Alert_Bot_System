const mongoose = require("mongoose");
const { Schema } = mongoose;

const AreaSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        problem: {
            type: String,
        },
        restoration: {
            type: String,
        },
        ZoneId: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Area", AreaSchema);

// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const Area = sequelize.define("Area", {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     problem: {
//         type: DataTypes.STRING,
//     },
//     restoration: {
//         type: DataTypes.STRING,
//     }
// });

// module.exports = Area;

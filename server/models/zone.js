const mongoose = require("mongoose");
const { Schema } = mongoose;

const ZoneSchema = new Schema(
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Zone", ZoneSchema);

// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const Zone = sequelize.define("Zone", {
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

// module.exports = Zone;

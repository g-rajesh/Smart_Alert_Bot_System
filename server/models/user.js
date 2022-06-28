const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        fName: {
            type: String,
            required: true
        },
        lName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        mno: {
            type: String,
            required: true
        },
        isVerified: {
            type: Number,
            required: true
        },
        AreaId: {
            type: Schema.Types.ObjectId,
            ref: 'Area'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);


// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const User = sequelize.define("User", {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true,
//     },
//     fName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     lName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     mno: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     isVerified: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     }
// });

// module.exports = User;

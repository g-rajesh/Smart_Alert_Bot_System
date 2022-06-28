const mongoose = require("mongoose");
const { Schema } = mongoose;

const OfficialSchema = new Schema(
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
        ZoneId: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Official", OfficialSchema);

// const { DataTypes } = require("sequelize");
// const sequelize = require("../util/database");

// const Official = sequelize.define("Official", {
//      id: {
//           type: DataTypes.INTEGER,
//           primaryKey: true,
//           allowNull: false,
//           autoIncrement: true,
//      },
//      fName: {
//           type: DataTypes.STRING,
//           allowNull: false,
//      },
//      lName: {
//           type: DataTypes.STRING,
//           allowNull: false,
//      },
//      email: {
//           type: DataTypes.STRING,
//           allowNull: false,
//           unique: true
//      },
//      password: {
//           type: DataTypes.STRING,
//           allowNull: false,
//      },
//      mno: {
//           type: DataTypes.STRING,
//           allowNull: false
//      }
// });

// module.exports = Official;

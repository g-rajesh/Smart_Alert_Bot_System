const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Official = sequelize.define("Official", {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
     },
     fName: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     lName: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
     },
     password: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     mno: {
          type: DataTypes.STRING,
          allowNull: false
     }
});

module.exports = Official;

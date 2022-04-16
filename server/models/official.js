const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Official = sequelize.define("Official", {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
     },
     firstName: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     lastName: {
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
     mobileNumber: {
          type: DataTypes.STRING,
          allowNull: false
     }
});

module.exports = Official;

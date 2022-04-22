const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const MessageWithUsers = sequelize.define("MessageWithUsers", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
});

module.exports = MessageWithUsers;

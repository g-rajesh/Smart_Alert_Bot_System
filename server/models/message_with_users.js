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
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    }
});

module.exports = MessageWithUsers;

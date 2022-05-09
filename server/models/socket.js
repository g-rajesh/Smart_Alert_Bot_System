const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Socket = sequelize.define("Socket", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    socketId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Socket;

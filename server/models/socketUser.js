const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const SocketUser = sequelize.define("SocketUser", {
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
    officialId: {
        type: DataTypes.INTEGER,
    }
});

module.exports = SocketUser;

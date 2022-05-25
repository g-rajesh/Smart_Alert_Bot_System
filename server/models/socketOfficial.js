const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const SocketOfficial = sequelize.define("SocketOfficial", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    socketId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = SocketOfficial;

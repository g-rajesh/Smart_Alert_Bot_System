const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Zone = sequelize.define("Zone", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    problem: {
        type: DataTypes.STRING,
    },
    restoration: {
        type: DataTypes.STRING,
    }
});

module.exports = Zone;

const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Feedback = sequelize.define("Feedback", {
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
    email: {
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
    userType: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Feedback;

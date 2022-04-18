const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tneb", "root", "Team_TNEB3@", {
     dialect: "mysql",
     host: "localhost",
     logging: false
});

module.exports = sequelize;

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tneb", "root", "Rajesh3@", {
     dialect: "mysql",
     host: "localhost",
});

module.exports = sequelize;

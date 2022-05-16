const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./util/database");
const Official = require("./models/official");
const User = require("./models/user");
const Zone = require("./models/zone");
const Area = require("./models/area");
const Message1 = require("./models/message_with_users");
const Message2 = require("./models/meesage_with_officials");
const Feedback = require("./models/feedback");
const Socket = require("./models/socket");

const userRoutes = require("./routes/user");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;
  return res.status(status).json({ message, data });
});

Zone.hasOne(Official);
Official.belongsTo(Zone);

Zone.hasMany(Area);
Area.belongsTo(Zone);

Area.hasMany(User);
User.belongsTo(User);

User.hasMany(Message1);
Message1.belongsTo(User);

Zone.hasMany(Message1);
Message1.belongsTo(Zone);

User.hasMany(Message2);
Message2.belongsTo(User);

Zone.hasMany(Message2);
Message2.belongsTo(Zone);

Zone.hasMany(Feedback);
Feedback.belongsTo(Zone);

User.hasOne(Socket);
Socket.belongsTo(User);

// mail password to env

sequelize
     // .sync({ force: true })
     // .sync({ alter: true })
     .sync()
     .then((result) => {
          console.log("Connected to Mysql database");
          app.listen(process.env.PORT, async () => {
               console.log(`Server starts listening to PORT ${process.env.PORT}`);
          });
     })
     .catch((err) => {
          console.log(err);
     });


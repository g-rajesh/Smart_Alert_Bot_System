const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
require("dotenv").config();

// socket connection imports
const { Server } = require("socket.io");

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

// http connection
app.use(express.json());
app.use(cors());

// socket server connection
const httpServer = createServer(app);
const io = new Server(httpServer);
httpServer.listen(process.env.PORT_S, () => {
     console.log(`Socket listenting at PORT ${process.env.PORT_S}`);
});

let uid = null
let officialId = null
io.on('connection', (soc) => {
     // user sends his uid to
     soc.on('uid', (data) => {
          uid = data.uid
          db[uid] = soc.id
          console.log('db: ', db)
     })

     // receive officals ID
     soc.on('officialId', (data) => {
          officialId = data.officialId
          db[officialId] = soc.id
          console.log('db: ', db)
     })

     // event emitted by official when we calls user
     soc.on('callUser', (data) => {
          // fetch socket id from db using this uid
          let socketId = db[data.uid]
          
          let officialId = data.officialId

          let newData = {
               officialId: officialId
          }
          // inform user that official is on call
          io.to(socketId).emit('officialOnCall', newData)
     })

     soc.on('endCallByOfficial', (data)=> {
          let socId = db[data.uid]
          io.to(socId).emit('officialEndedCall')
     })

     soc.on('endCallByUser', (data) => {
          let socId = db[data.officialId]
          io.to(socId).emit('userEndedCall')
     })
})

// http connection implementation
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
               console.log(`Server starts listening at PORT ${process.env.PORT}`);
          });
     })
     .catch((err) => {
          console.log(err);
     });


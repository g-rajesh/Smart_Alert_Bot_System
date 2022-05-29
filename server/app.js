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
const SocketUser = require("./models/socketUser");
const SocketOfficial = require("./models/socketOfficial");

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

     soc.on('uid', async (data) => {
          uid = data.uid
          // db[uid] = soc.id --> insert user soc id into socketUser
          
          try {
               let socUser = await SocketUser.findOne({ where: { UserId: uid } });
               if(!socUser) {
                    socUser = await SocketUser.create({
                         UserId: uid,
                         socketId: soc.id,
                    });
                    await socUser.save();
               } else {
                    await SocketUser.update(
                         { socketId: soc.id },
                         { where: { UserId: uid } }
                    );
               }
          } catch(err) {
               console.log("user sends his uid: ", err);
          }
     })

     // receive officals ID
     soc.on('officialId', async (data) => {
          officialId = data.officialId
          
          try{
               let socOfficial = await SocketOfficial.findOne({ where: { OfficialId: officialId } });

               if(!socOfficial) {
                    socOfficial = await SocketOfficial.create({
                         OfficialId: officialId,
                         socketId: soc.id,
                    });
                    await socOfficial.save();
               } else {
                    await SocketOfficial.update(
                         { socketId: soc.id },
                         { where: { OfficialId: officialId } }
                    );
               }

          } catch(e){
               console.log('officialID event err:',err);
          }
          
     })

     // event emitted by official when we calls user
     soc.on('callUser', async (data) => {
          // fetch socket id from db using this uid
          try {
               let socket = await SocketUser.findOne({where: {UserId: data.uid}});
               let socketId = socket.dataValues.socketId;

               let officialId = data.officialId

               let newData = {
                    officialId: officialId
               }
               console.log('callUser: ', newData)
               // inform user that official is on call
               io.to(socketId).emit('officialOnCall', newData)
          } catch(err) {
               console.log("event emitted by official when we calls user", err);
          }
     })

     soc.on("userAttendedCall", async (data)=> {
          console.log('data', data)
          officialId = data.officialId
          let socOfficial = await SocketOfficial.findOne({ where: { OfficialId: officialId } })
          let sockId = socOfficial.dataValues.socketId
          console.log('user atttended call is emiitter to : ', sockId)
          io.to(sockId).emit("userAttended")
     })

     soc.on('endCallByOfficial', async (data)=> {
          console.log('end call by official, ',data)
          try {
               let socket = await SocketUser.findOne({where: {UserId: data.uid}});
               let socketId = socket.dataValues.socketId;
               io.to(socketId).emit('officialEndedCall')
          } catch (err) {
               console.log("endCallByOfficial", err);
          }
     })

     soc.on('endCallByUser', async (data) => {
          try{
               let socket = await SocketOfficial.findOne({where: {OfficialId: data.officialId}});
               let socketId = socket.dataValues.socketId;
               io.to(socketId).emit('userEndedCall')
          }
          catch(err){
               console.log('end call by user error: ', err);
          }
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

User.hasOne(SocketUser);
SocketUser.belongsTo(User);

Official.hasOne(SocketOfficial);
SocketOfficial.belongsTo(Official);

// mail password to env

sequelize
     // .sync({ force: true })
     // .sync({ alter: true })
     .sync()
     .then(() => {
          console.log("Connected to Mysql database");
          app.listen(process.env.PORT, async () => {
               console.log(`Server starts listening at PORT ${process.env.PORT}`);
          });
     })
     .catch((err) => {
          console.log(err);
     });


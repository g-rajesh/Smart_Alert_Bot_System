const express = require("express");
const mongoose = require("mongoose");
const { createServer } = require("http");
const cors = require("cors");
require("dotenv").config();

// socket connection imports
const { Server } = require("socket.io");

const SocketUser = require("./models/socketUser");
const SocketOfficial = require("./models/SocketOfficial");

const userRoutes = require("./routes/user");

const app = express();

const options = {
     origin: '*',
}

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
               let socUser = await SocketUser.findOne({ UserId: uid });
               if(!socUser) {
                    socUser = await SocketUser.create({
                         UserId: uid,
                         socketId: soc.id,
                    });
                    await socUser.save();
               } else {
                    await SocketUser.updateOne(
                         { UserId: uid },
                         { socketId: soc.id }
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
               let socOfficial = await SocketOfficial.findOne({ OfficialId: officialId });

               if(!socOfficial) {
                    socOfficial = await SocketOfficial.create({
                         OfficialId: officialId,
                         socketId: soc.id,
                    });
                    await socOfficial.save();
               } else {
                    await SocketOfficial.updateOne(
                         { OfficialId: officialId },
                         { socketId: soc.id }
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
               let socket = await SocketUser.findOne({ UserId: data.uid });
               let socketId = socket.socketId;

               let officialId = data.officialId

               let newData = {
                    officialId: officialId
               }
               // inform user that official is on call
               io.to(socketId).emit('officialOnCall', newData)
          } catch(err) {
               console.log("event emitted by official when we calls user", err);
          }
     })

     soc.on("userAttendedCall", async (data)=> {
          officialId = data.officialId
          let socOfficial = await SocketOfficial.findOne({ OfficialId: officialId })
          let sockId = socOfficial.socketId
          io.to(sockId).emit("userAttended")
     })

     soc.on('endCallByOfficial', async (data)=> {
          try {
               let socket = await SocketUser.findOne({ UserId: data.uid });
               let socketId = socket.socketId;
               io.to(socketId).emit('officialEndedCall')
          } catch (err) {
               console.log("endCallByOfficial", err);
          }
     })

     soc.on('endCallByUser', async (data) => {
          try{
               let socket = await SocketOfficial.findOne({ OfficialId: data.officialId });
               let socketId = socket.socketId;
               io.to(socketId).emit('userEndedCall')
          }
          catch(err){
               console.log('end call by user error: ', err);
          }
     })
})

app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

app.get("/", (req, res, next) => {
     return res.status(200).json({ "message": "Hello fro server" });
})
   

// http connection implementation
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
     const status = error.status || 500;
     const message = error.message;
     const data = error.data;
     return res.status(status).json({ message, data });
});

mongoose.connect(process.env.DB_URL).then(() => {
     console.log("Connected to MongoDB database");
     app.listen(process.env.PORT, async () => {
          console.log(`Server starts listening at PORT ${process.env.PORT}`);
     });
 });

const Socket = require("../models/socket");

const updateSocket = async (userId, socketId) => {
    const socket = await Socket.findOne({where: {userId}});
    if(socket) {
        // update
        await Socket.update({socketId}, {where: {userId}});
    } else {
        // create
        const newSocket = await Socket.create({socketId, userId});
        await newSocket.save();
    }
}

const getSocketId = async (userId) => {
    const socket = await Socket.findOne({where: {userId}});

    return socket.dataValues.socketId;
}


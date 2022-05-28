import AgoraRTC from "agora-rtc-sdk-ng"
import axios from "axios";
import userSlice from "../app/reducers/userSlice";

// require("dotenv").config();



// let options = {
//     appId: process.env.APP_ID,
//     channel: '',
//     uid: , // user's ID. It should not match with any of the official's ID
//     role: 'audience',
//     tokenType: 'uid'
// };

let rtc_new = {
    client: null,
    localAudioTrack: null
}

const handeVoiceCallStart = async (rtc, socket, id, email) => {
    rtc_new.client = rtc.client
    let channel = email.split('@')[0];
    let options = {
        appId: "78396c152c624a65b212ca2922a1fa6c",
        channel: channel,
        uid: id, 
        role: 'audience',
        tokenType: 'uid'
    };

    const body = {
        channelName: options.channel,
        uid: options.uid,
        role: options.role,
        tokenType: options.tokenType
    }    
    let token;

    let data = {
        officialId: JSON.parse(localStorage.getItem('officialId'))
    }
    console.log('offid: ', data.officialId)
    console.log('socket: ', socket.id)
    socket.emit("userAttendedCall", data)

    await axios.post("http://localhost:8080/user/rtcToken", body, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
        }})
        .then(res => {
            token = res.data.rtcToken
            console.log('token: ', token)
        })
        .catch(err => {
            console.log('fetch token error: ', err)
        })

        console.log('options; ', options)

    await rtc_new.client.join(options.appId, options.channel, token, options.uid);
    rtc_new.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    console.log('rtc 12345', rtc_new.localAudioTrack)
    await rtc.client.publish([rtc_new.localAudioTrack]);
    console.log("publish success!");

    //notify the user and pop up a modal with a button 'connect' to join the voice call channel
}

const handleOfficialEndCall = async () => {
    console.log('official ended call !')
    rtc_new.localAudioTrack.close();
    await rtc_new.client.leave();
}

const handleVoiceCallEnd = async (socket) => {
    console.log("user end call socket id: " , socket.id)
    rtc_new.localAudioTrack.close();
    await rtc_new.client.leave();
    // window.alert('you (user) disconected the call !')

    // to notify the offical that user has cut the call
    let newData = {
        officialId: JSON.parse(localStorage.getItem('officialId'))
    }
    socket.emit('endCallByUser', newData)
}

export { handeVoiceCallStart, handleOfficialEndCall, handleVoiceCallEnd };
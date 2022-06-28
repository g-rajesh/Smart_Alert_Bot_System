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
    socket.emit("userAttendedCall", data)

    await axios.post("http://localhost:8080/user/rtcToken", body, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
        }})
        .then(res => {
            token = res.data.rtcToken
        })
        .catch(err => {
            console.log('fetch token error: ', err)
        })


    await rtc_new.client.join(options.appId, options.channel, token, options.uid);
    rtc_new.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await rtc.client.publish([rtc_new.localAudioTrack]);

    //notify the user and pop up a modal with a button 'connect' to join the voice call channel
}

const handleOfficialEndCall = async () => {
    rtc_new.localAudioTrack.close();
    await rtc_new.client.leave();
}

const handleVoiceCallEnd = async (socket) => {
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
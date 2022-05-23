import AgoraRTC from "agora-rtc-sdk-ng"
import axios from "axios";

// require("dotenv").config();

let rtc = {
    localAudioTrack: null,
    client: null
};

// let options = {
//     appId: process.env.APP_ID,
//     channel: '',
//     uid: , // user's ID. It should not match with any of the official's ID
//     role: 'audience',
//     tokenType: 'uid'
// };

const handeVoiceCallStart = async (id, email) => {
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

    await rtc.client.join(options.appId, options.channel, token, options.uid);
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await rtc.client.publish([rtc.localAudioTrack]);
    console.log("publish success!");

    //notify the user and pop up a modal with a button 'connect' to join the voice call channel
}

const handleOfficialEndCall = async () => {
    rtc.localAudioTrack.close();
    await rtc.client.leave();
    window.alert('official ended call !')
}

const handleVoiceCallEnd = async (socket, officialId) => {
    rtc.localAudioTrack.close();
    await rtc.client.leave();
    window.alert('you (user) disconected the call !')

    // to notify the offical that user has cut the call
    let newData = {
        officialId: officialId
    }
    socket.emit('endCallByUser', newData)
}

export { handeVoiceCallStart, handleOfficialEndCall, handleVoiceCallEnd };
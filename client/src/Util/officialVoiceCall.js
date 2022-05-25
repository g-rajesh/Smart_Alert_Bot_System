import AgoraRTC from "agora-rtc-sdk-ng"
import axios from "axios";

let rtc = {
    localAudioTrack: null,
    client: null
};

let tokenServerURL = "http://localhost:8080/user/rtcToken"

let options = {
    channel: '',
    uid: '',    // official id
    role: 'publisher',
    tokenType: 'uid'
}

let data = {
    uid: null,
    officialId: options.uid
}

let socket;

const handleSocketConnection = async (socket, user, officialId) => { 
    socket = socket
    data.uid = user.id
    options.channel = user.email.split('@')[0]
    options.uid = officialId
    console.log(' official initiated call')
    
    socket.emit('callUser', data)

    // initiate the voice call
    handeVoiceCallStart()
}


const handeVoiceCallStart = async () => {
    const body = {
        channelName: options.channel,
        uid: options.uid,
        role: options.role,
        tokenType: options.tokenType
    }    
    let token;
    await axios.post(tokenServerURL, body, {
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
}

const handleUserEndedcall = async () => {
    rtc.localAudioTrack.close();
    await rtc.client.leave();
    window.alert('User has ended the call !')
}

const handleVoiceCallEnd = async () => {
    rtc.localAudioTrack.close();
    await rtc.client.leave();
    window.alert('you (official) has disconnected the call !')
    // notify user that official has cut the call
    socket.emit('endCallByOfficial', data)
}

export {handleSocketConnection, handeVoiceCallStart, handleUserEndedcall, handleVoiceCallEnd}
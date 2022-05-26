import AgoraRTC from "agora-rtc-sdk-ng"
import axios from "axios";


let tokenServerURL = "http://localhost:8080/user/rtcToken"

let options = {
    appId: '78396c152c624a65b212ca2922a1fa6c',
    channel: '',
    uid: '',    // official id
    role: 'publisher',
    tokenType: 'uid'
}

let data = {
    uid: null,
    officialId: null
}

let socket;

const handleSocketConnection = async (rtc, socket, user, officialId) => { 
    socket = socket
    data.uid = user.id
    options.channel = user.email.split('@')[0]
    options.uid = officialId
    data.officialId = options.uid
    console.log(' official initiated call rtc: ', rtc)
    
    socket.emit('callUser', data)

    // initiate the voice call
    handeVoiceCallStart(rtc)
}


const handeVoiceCallStart = async (rtc) => {
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
    await rtc.client.publish([rtc.localAudioTrack]).then().catch(e => console.log('rtc error: ', e));
    console.log("publish success!");
}

const handleUserEndedcall = async (rtc) => {
    rtc.localAudioTrack.close();
    await rtc.client.leave().then().catch(e => console.log('rtc error: ', e));
    window.alert('User has ended the call !')
}

const handleVoiceCallEnd = async (rtc) => {
    console.log('offical end rtc: ', rtc)
    rtc.localAudioTrack.close();
    await rtc.client.leave().then().catch(e => console.log('rtc error: ', e))
    window.alert('you (official) has disconnected the call !')
    // notify user that official has cut the call
    socket.emit('endCallByOfficial', data)
}

export {handleSocketConnection, handeVoiceCallStart, handleUserEndedcall, handleVoiceCallEnd}
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

let socket_new;

let rtc_new = {
    client: null,
    localAudioTrack: null
}

const handleSocketConnection = async (rtc, socket, user, officialId) => {
    socket_new = socket
    data.uid = user.id
    options.channel = user.email.split('@')[0]
    options.uid = officialId
    data.officialId = options.uid
    socket_new.emit('callUser', data)
    rtc_new.client = rtc.client
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

    await rtc_new.client.join(options.appId, options.channel, token, options.uid);
    rtc_new.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await rtc_new.client.publish([rtc_new.localAudioTrack]).then().catch(e => console.log('rtc error: ', e));
    console.log("publish success! rtc: ", rtc_new.localAudioTrack);
}

const handleUserEndedcall = async () => {
    console.log('User has ended the call !')
    rtc_new.localAudioTrack.close();
    await rtc_new.client.leave().then().catch(e => console.log('rtc error: ', e));
}

const handleVoiceCallEnd = async () => {
    rtc_new.localAudioTrack.close();
    await rtc_new.client.leave().then().catch(e => console.log('rtc error: ', e))
    // window.alert('you (official) has disconnected the call !')
    // notify user that official has cut the call
    console.log('socket: ', socket_new)
    socket_new.emit('endCallByOfficial', data)
}

export {handleSocketConnection, handeVoiceCallStart, handleUserEndedcall, handleVoiceCallEnd}
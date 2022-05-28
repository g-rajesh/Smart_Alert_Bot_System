const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
require("dotenv").config();


exports.generateRTCToken = (req, res, next) => {
    console.log("Called");
    const {channelName, uid} = req.body
    
    res.header('Access-Control-Allow-Origin', '*');

    if (!channelName) {
        return res.status(500).json({ 'error': 'channel is required' });
    }

    if(!uid || uid === '') {
        return res.status(500).json({ 'error': 'uid is required' });
    }

    if (req.body.role === 'publisher') {
        role = RtcRole.PUBLISHER;
    } else if (req.body.role === 'audience') {
        role = RtcRole.SUBSCRIBER
    } else {
        return res.status(500).json({ 'error': 'role is incorrect' });
    }

    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }

    const APP_ID_AGORA = process.env.APP_ID_AGORA;
    const APP_CERTIFICATE = process.env.APP_CERTIFICATE
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    let token = null;
    if (req.body.tokenType === 'userAccount') {
        token = RtcTokenBuilder.buildTokenWithAccount(APP_ID_AGORA, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime)
    } else if (req.body.tokenType === 'uid') {
        token = RtcTokenBuilder.buildTokenWithUid(APP_ID_AGORA, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime)
    }  else {
        return res.status(500).json({ 'error': 'token type is invalid' });
    }

    // console.log('token: ', token)
    return res.json({ 'rtcToken': token });
}

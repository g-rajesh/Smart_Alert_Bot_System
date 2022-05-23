const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
require("dotenv").config();

exports.generateRTCToken = async (req, resp) => {
    console.log("Called");
    const {channelName, uid} = req.body
    resp.header('Access-Control-Allow-Origin', '*');

    if (!channelName) {
        return resp.status(500).json({ 'error': 'channel is required' });
    }

    if(!uid || uid === '') {
        return resp.status(500).json({ 'error': 'uid is required' });
    }

    if (req.body.role === 'publisher') {
        role = RtcRole.PUBLISHER;
    } else if (req.body.role === 'audience') {
        role = RtcRole.SUBSCRIBER
    }  else {
        return resp.status(500).json({ 'error': 'role is incorrect' });
    }

    let expireTime = req.query.expiry;
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    let token = null;
    if (req.body.tokenType === 'userAccount') {
        token = RtcTokenBuilder.buildTokenWithAccount(process.env.APP_ID, process.env.APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime)
    } else if (req.body.tokenType === 'uid') {
        token = RtcTokenBuilder.buildTokenWithUid(process.env.APP_ID, process.env.APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime)
    }  else {
        return resp.status(500).json({ 'error': 'token type is invalid' });
    }

    console.log('token: ', token)
    return resp.json({ 'rtcToken': token });
}

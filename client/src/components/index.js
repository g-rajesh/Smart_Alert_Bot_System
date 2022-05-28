import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from "react-router-dom"

import AgoraRTC from "agora-rtc-sdk-ng"
import io from "socket.io-client";

import Navbar from "./Navbar";
import Home from "./Home";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Chat from "./Chat";
import Feedback from "./Feedback"; 
import Dashboard from "./Dashboard"; 
import Status from "./Status"; 
import CallUser from "../Util/CallUser";
import CallOfficial from "../Util/CallOfficial";

import { handeVoiceCallStart, handleOfficialEndCall } from '../Util/userVoiceCall';
import { handleUserEndedcall } from '../Util/officialVoiceCall';
import { updateAttend, updateUserRTC, updateUserSocket, updateViewCall } from '../app/reducers/userSlice';


const Root = () => {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const type = user ? user.type : null;

    let rtc = {
        localAudioTrack: null,
        client: null
    };

    let socket, officialId

    if(type) {
        rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

        rtc.client.on("user-published", async (user, mediaType) => {
            await rtc.client.subscribe(user, mediaType);
            
            console.log("subscribe success");

            if (mediaType === "audio") {
                const remoteAudioTrack = user.audioTrack;
                remoteAudioTrack.play();
            }

            rtc.client.on("user-unpublished", async (user) => {
                console.log('unsubscribed user: ', user.uid)
                await rtc.client.unsubscribe(user);
            });
        })

        
        socket = io( "http://localhost:9080", { upgrade: false, transports: ['websocket'] });

        if(type === "official") {
            let data = { officialId: user.id }

            socket.on('connect', () => {
                socket.emit('officialId', data)
                console.log(' offical socket connected !')

                socket.on('userEndedCall', () => {
                    dispatch(updateViewCall(false))
                    handleUserEndedcall(rtc)
                })

                socket.on("userAttended", ()=>{
                    dispatch(updateAttend(true))
                    console.log('user attended our call')
                })
            })

        } else if(type === "user"){
            let socketId ;
            console.log('user type is user')
            let data = { uid: user.id, fName: user.fName };

            socket.on('connect', () => {

                socketId = socket.id
                console.log('user connected! ', socketId)

                socket.emit('uid', data)

                socket.on('officialOnCall', (data) => {
                    officialId = data.officialId
                    console.log('off id inside socket', data)
                    localStorage.setItem('officialId', JSON.stringify(officialId))

                    console.log('official on call: ', officialId)

                    dispatch(updateViewCall(true))
                })

                socket.on('officialEndedCall', () => {
                    dispatch(updateViewCall(false))
                    handleOfficialEndCall(rtc)
                })
            })
        }



    }

    
    const callHandler = (type) => {
        switch(type) {
            case "user":
                return <CallUser socket={socket} officialId={officialId} rtc={rtc} />
            case "official":
                return <CallOfficial rtc={rtc} />
        }
    }


    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="signup" element={ <SignUp /> } />
                <Route path="signin" element={ <SignIn /> } />
                <Route path="chat" element={ <Chat rtc={rtc} /> } />
                <Route path="feedback" element={ <Feedback /> } />
                <Route path="dashboard" element={ <Dashboard socket={socket} rtc={rtc} />  } />
                <Route path="status" element={ <Status /> } />
            </Routes>
            {
                user && user.viewCall && callHandler(type)
            }
        </>
    )
}

export default Root
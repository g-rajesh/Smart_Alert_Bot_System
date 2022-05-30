import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from "react-router-dom"
import ReactAudioPlayer from 'react-audio-player';

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
import calling from "../audio/calling.mp3";

import { handleOfficialEndCall } from '../Util/userVoiceCall';
import { handleUserEndedcall } from '../Util/officialVoiceCall';
import { updateAttend, updateViewCall } from '../app/reducers/userSlice';


const Root = () => {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const type = user ? user.type : null;

    let rtc = {
        // localAudioTrack: null,
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

        // dispatch(updateUserRTC(rtc))

        
        socket = io( "http://localhost:9080", { upgrade: false, transports: ['websocket'] });

        if(type === "official") {
            let data = { officialId: user.id }

            socket.on('connect', () => {
                // dispatch(updateUserSocket(socket))
                socket.emit('officialId', data)
                console.log(' offical socket connected !')

                socket.on('userEndedCall', () => {
                    dispatch(updateViewCall(false))
                    handleUserEndedcall()
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
                    // official ended call
                    console.log('officalEndedCall emit received')
                    dispatch(updateViewCall(false))
                    handleOfficialEndCall()
                })
            })
        }
    }

    
    const callHandler = (type) => {
        switch(type) {
            case "user":
                return <CallUser socket={socket} rtc={rtc} />
            case "official":
                return <CallOfficial rtc={rtc} />
        }
    }

    let isPlaying = false;
    if(user && user.type==="user" && user.viewCall && !user.attend) {
        isPlaying = true;
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
            {
                isPlaying && 
                <ReactAudioPlayer
                    src={calling}
                    autoPlay="true"
                    loop="true"
                />
            }
        </>
    )
}

export default Root
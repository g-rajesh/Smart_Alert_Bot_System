import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
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

const Root = () => {
    const user = useSelector(state => state.user.user);

    const type = user ? user.type : null;

    let rtc = {
        localAudioTrack: null,
        client: null
    };

    let socket, officialId

    if(type) {
        
        socket = io( "http://localhost:9080", { upgrade: false, transports: ['websocket'] });
        if(type === "official") {
            // let data = { uid: 98765,  officialId: user.id }

            // socket.on('connect', () => {
            //     socketId = socket.id
            //     console.log(socketId)
            //     socket.emit('officialId', data)

            //     socket.on('userEndedCall', () => {
            //         handleUserEndedcall()
            //     })
            // })
        } else if(type === "user"){
            let socketId ;

            let data = { uid: user.id, fName: user.fName };

            socket.on('connect', () => {            
                socketId = socket.id
                console.log('user connected! ', socketId)

                socket.emit('uid', data)

                socket.on('officialOnCall', (data) => {
                    officialId = data.officialId

                    // update db row wrt to user & official -> insert offId in the uId row
                    console.log('official on call: ', officialId)

                    window.alert('official on call')

                    // open the pop up with a button with ATTEND and END button
                    // When ATTEND button is clicked, initialise voice call.
                    handeVoiceCallStart(user.id, user.email)

                    // when END button is clicked, end voice call.
                })

                socket.on('officialEndedCall', () => {
                    // official ended call
                    handleOfficialEndCall()
                })
            })
        }
    }

    useEffect(() => {
        if(type){
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
        }
        
    }, [type])
    
    const callHandler = (type) => {
        switch(type) {
            case "user":
                return <CallUser socket={socket} officialId={officialId} />
            case "official":
                return <CallOfficial />
        }
    }


    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="signup" element={ <SignUp /> } />
                <Route path="signin" element={ <SignIn /> } />
                <Route path="chat" element={ <Chat/> } />
                <Route path="feedback" element={ <Feedback /> } />
                <Route path="dashboard" element={ <Dashboard socket={socket} />  } />
                <Route path="status" element={ <Status /> } />
            </Routes>
            {
                user && user.viewCall && callHandler(type)
            }
        </>
    )
}

export default Root
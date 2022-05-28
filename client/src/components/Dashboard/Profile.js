import React from 'react'
import { useDispatch } from 'react-redux';
import ReactAudioPlayer from 'react-audio-player';

import { FaPhoneAlt, FaHome, FaTimes, FaChevronRight } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'
import { updateViewCall } from '../../app/reducers/userSlice';
import calling from "../../audio/calling.mp3";

import { handleSocketConnection } from '../../Util/officialVoiceCall'

const Profile = ({selectedUser, setToggleUpDown, user, socket, rtc}) => {

    const dispatch = useDispatch();

    if(!selectedUser) {
        return (
            <div className="profile">
                <span>No user selected</span>
            </div>
        )
    }

    const viewCall = async () => {
        console.log('offical calling rtc: ', rtc.localAudioTrack )
        await handleSocketConnection(rtc, socket, selectedUser, user.id)
        console.log('socket connection -> voice call start , rtc: ', rtc.localAudioTrack)
        dispatch(updateViewCall(true));
    }

    let isPlaying = false;
    if(user.viewCall && !user.attend) {
        isPlaying = true;
    }

    return (
        <div className="profile">
            <div className="tp">
                <span>{selectedUser && selectedUser.fName[0]}</span>
                <div className="pf">
                    <p>{selectedUser && selectedUser.fName}</p>
                    {
                        selectedUser && selectedUser.isVerified ? (
                            <span className="success">Verified</span>
                        ) : (
                            <div className='verifier'>
                                <span className="error">Not Verified</span>
                                <FaChevronRight className='right-icon' />
                                <a href="https://www.gmail.com">Verify here</a>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="bt">
                <p><FaPhoneAlt className='bt-icon phone-icon' /> {selectedUser && selectedUser.mno}</p>
                <p><MdAlternateEmail className='bt-icon email-icon' /> {selectedUser && selectedUser.email}</p>
                <p><FaHome className='bt-icon home-icon' /> {selectedUser && selectedUser.area}</p>
                <span className='attend-call' onClick={viewCall}>Join call</span>
            </div>
            <div className="close" onClick={()=>setToggleUpDown(false)}><FaTimes className='close-icon' /></div>
            {/* {
                isPlaying && 
                <ReactAudioPlayer
                    src={calling}
                    autoPlay="true"
                    loop="true"
                />
            } */}
        </div>
    )
}

export default Profile

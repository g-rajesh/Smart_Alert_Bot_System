import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { ImUser, ImPhone, ImPhoneHangUp } from 'react-icons/im'

import { updateAttend, updateViewCall } from '../app/reducers/userSlice';
import { handleVoiceCallEnd } from './officialVoiceCall';

const CallOfficial = ({rtc}) => {
    
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);

    
    const user = useSelector(state => state.user.user);
    const attend = user && user.attend;

    const dispatch = useDispatch();

    useEffect(() => {
        
        if(!user.attend){   
            setSeconds(0)
            setMinutes(0)
        }
        let timer = setTimeout(()=>{
            setSeconds(seconds+1);

            if(seconds === 59) {
                setMinutes(minutes+1);
                setSeconds(0);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [seconds, user.attend]);

    const cutCall = () => {
        dispatch(updateAttend(false));
        dispatch(updateViewCall(false));
        console.log('offical ended call rtc: ', rtc.localAudioTrack)
        handleVoiceCallEnd(rtc);
    }

    // page change -> time resets(change)

    return (
        <div className='call'>
            <div className="content">
                <ImUser className='user-icon' />
                <p>{attend ? "Rajesh": "Calling Rajesh"}</p>
                <span className={!attend ? "mb": ""}>Tiruvottiyur</span>
                {
                    attend && 
                    <p className='timer'>
                        {minutes < 10 ? "0"+minutes : minutes}&nbsp;:&nbsp;{seconds < 10 ? "0"+seconds : seconds}
                    </p>
                }

                <div className="btns">
                    <span className='cut-btn' onClick={cutCall}><ImPhoneHangUp className='call-btn' /></span>
                </div>
            </div>
        </div>
    )
}

export default CallOfficial;
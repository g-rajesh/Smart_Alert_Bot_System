import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { ImUser, ImPhone, ImPhoneHangUp } from 'react-icons/im'

// import { useSpeechSynthesis } from 'react-speech-kit';
import { updateAttend, updateViewCall } from '../app/reducers/userSlice';
import { handleVoiceCallEnd, handeVoiceCallStart } from './userVoiceCall';

const CallUser = ({rtc, socket}) => {
    
    // const { speak } = useSpeechSynthesis();

    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const user = useSelector(state => state.user.user);
    const attend = user && user.attend;

    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(()=>{
            setSeconds(seconds+1);

            if(seconds === 59) {
                setMinutes(minutes+1);
                setSeconds(0);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [seconds]);

    // useEffect(()=>{
    //     const call = setTimeout(()=>{
    //         if(!attend) {
    //             // co);
    //             speak({text: "Official is Calling"});
    //         }
    //     }, 1000);

    //     return () => clearTimeout(call);
    // }, []);


    //Team_TNEB3@ 


    // useEffect(()=>{
    //     const print = setInterval(()=>{
    //         console.log("Hello");
    //     }, 100);

    //     return () => clearInterval(print);
    // }, []);

    // page change -> time resets(change)

    const attendCall = () => {
        // setAttend(true);
        dispatch(updateAttend(true));
        setSeconds(0);
        setMinutes(0);
        handeVoiceCallStart(rtc, socket, user.id, user.email)
    }

    const cutCall = () => {
        dispatch(updateAttend(false));
        dispatch(updateViewCall(false));

        handleVoiceCallEnd(socket)
    }

    return (
        <div className='call'>
            <div className="content">
                <ImUser className='user-icon' />
                <p>Official is Calling</p>
                <span className={!attend ? "mb": ""}>Tiruvottiyur</span>
                {
                    attend && 
                    <p className='timer'>
                        {minutes < 10 ? "0"+minutes : minutes}&nbsp;:&nbsp;{seconds < 10 ? "0"+seconds : seconds}
                    </p>
                }

                <div className="btns">
                    {
                        !attend &&
                        <span className='attend-btn' onClick={attendCall}><ImPhone className='call-btn' /></span>
                    }
                    <span className='cut-btn' onClick={cutCall}><ImPhoneHangUp className='call-btn' /></span>
                </div>
            </div>
        </div>
    )
}

export default CallUser;
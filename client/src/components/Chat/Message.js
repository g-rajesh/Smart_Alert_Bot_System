import React, {useEffect, useRef} from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useSpeechSynthesis } from 'react-speech-kit';

const Message = ({messages}) => {
    const user = useSelector(state => state.user.user);

    const { speak } = useSpeechSynthesis();
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView();
    }, [messages]);

    return (
        <div className="messages">
            {
                messages.map(({ id, from, message, createdAt }) => {
                    if(from == user.fName) {
                        return (
                            <div className="message right" key={id}>
                                <div></div>
                                <div className='msg'>
                                    <div className='msg-text'>
                                        <p>{message}</p>
                                        <span>{moment(createdAt).format('LT')} &middot; <i className="uil uil-volume-up" onClick={() => speak({ text: message })}></i></span>
                                    </div>
                                    <span className='msg-profile'>{from[0]}</span> 
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div className="message left" key={id}>
                                <div className='msg'>
                                    <span className='msg-profile'>{from[0]}</span> 
                                    <div className='msg-text'>
                                        <p>{message}</p>
                                        <span>{moment(createdAt).format('LT')} &middot; <i className="uil uil-volume-up" onClick={() => speak({ text: message })}></i></span>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                        )
                    }
                })
            }
            <div ref={messageEndRef}></div>
        </div>
    );
}

export default Message
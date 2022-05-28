import React, {useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FaVolumeUp, FaChevronUp} from 'react-icons/fa'
import { useSpeechSynthesis } from 'react-speech-kit';

const Messages = ({messages, loading, setToggleUpDown}) => {
    const user = useSelector(state => state.user.user);

    const { speak } = useSpeechSynthesis();
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView();
    }, [messages]);

    let isMessagesEmpty = true;
    Object.keys(messages).map(key => {
        if(messages[key].length) {
            isMessagesEmpty = false;
        }
    });

    if(loading) {
        return <div className="messages">
            <span className='alert-msg'>Loading messages...</span>
        </div>
    }

    if(isMessagesEmpty) {
        return <div className="messages">
            <span className='alert-msg'>No messages yet!</span>
        </div>
    }

    return (
        <div className="messages">
            {
                Object.keys(messages).map(key => {
                    return (
                        <div className="dateMessage" key={key}>
                            <div className="date">
                                { messages[key].length ? <span>{moment(key).format('ll')}</span> : null}
                            </div>
                            {
                                messages[key].map(({id, from, message, createdAt, UserId}) => {
                                    if(UserId === user.id) {
                                        return (
                                            <div className="message rm" key={id}>
                                                <div></div>
                                                <div className='msg'>
                                                    <div className='msg-text'>
                                                        <p>{message}</p>
                                                        <span>{moment(createdAt).format('LT')} &middot; <FaVolumeUp className="vol-icon" onClick={() => speak({ text: message })}/></span>
                                                    </div>
                                                    <span className='msg-profile'>{from[0]}</span> 
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="message lm" key={id}>
                                                <div className='msg'>
                                                    <span className='msg-profile'>{from[0]}</span> 
                                                    <div className='msg-text'>
                                                        <p>{message}</p>
                                                        <span>{moment(createdAt).format('LT')} &middot;  <FaVolumeUp className="vol-icon" onClick={() => speak({ text: message })}/></span>
                                                    </div>
                                                </div>
                                                <div></div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    )
                })
            }
            <div ref={messageEndRef}></div>
            <div className="up-toggle">
                {
                    <FaChevronUp className="up-icon" onClick={()=>setToggleUpDown(true)} />
                }
            </div>
        </div>
    );
}

export default Messages;

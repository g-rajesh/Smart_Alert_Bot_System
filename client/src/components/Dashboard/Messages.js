import React, {useEffect, useRef} from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment';
import {FaVolumeUp} from 'react-icons/fa'
import { useSpeechSynthesis } from 'react-speech-kit';

const Messages = ({messages, setSelectedUser, loading, setToggleUpDown}) => {
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

    const findClass = (type) => {
        switch(type) {
            case 1:
                return "msg-text one"
            case 2:
                return "msg-text two"
            case 3:
                return "msg-text three"
            case 4:
                return "msg-text four"
        }
    }

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

    const handleMore = (user) => {
        setSelectedUser(user);
        setToggleUpDown(true);
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
                                messages[key].map(({id, user, message, createdAt, type }) => {
                                    return (
                                        <div className="message lm" key={id}>
                                            <div className='msg'>
                                                <span className='msg-profile'>{user.fName[0]}</span> 
                                                <div className={findClass(type)}>
                                                    <p>{message}</p>
                                                    <div className="u-prof">
                                                        <span onClick={()=>handleMore(user)}>More</span>
                                                        <span>{moment(createdAt).format('LT')} &middot;  <FaVolumeUp className="vol-icon" onClick={() => speak({ text: message })}/></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div></div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            <div ref={messageEndRef}></div>
        </div>
    );
}

export default Messages;

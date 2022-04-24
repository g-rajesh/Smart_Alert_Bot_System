import React, {useEffect, useRef} from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useSpeechSynthesis } from 'react-speech-kit';
import Message from './Message';

const Messages = ({messages, loading}) => {
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

    // console.log(messages);

    if(loading) {
        return (
            <div className="messages active">
                <span className='alert-msg'>Loading messages...</span>
            </div>
        )
    }

    if(isMessagesEmpty) {
        return (
            <div className="messages active">
                <span className='alert-msg'>No messages yet!</span>
            </div>
        )
    }

    return (
        <div className="messages active">
            {
                Object.keys(messages).map(key => {
                    return (
                        <div className="dateMessage" key={key}>
                            <div className="date">
                                { messages[key].length ? <span>{moment(key).format('ll')}</span> : null}
                            </div>
                            {
                                messages[key].map(message => {
                                    return <Message msg={message} key={message.id} />
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
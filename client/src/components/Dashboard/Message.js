import React, { useState } from 'react'
import moment from 'moment';
import { useSpeechSynthesis } from 'react-speech-kit';

const Message = ({msg}) => {
    const [more, setMore] = useState(false);
    const { speak } = useSpeechSynthesis();

    if(!msg) {
        return ;
    }

    const { message, createdAt, user } = msg;

    return (
        <div className="message left">
            <div className='msg'>
                <span className='msg-profile'>{user?.fName[0]}</span> 
                <div className='msg-text'>
                    <p>{message}</p>
                    <div className="expand">
                        <span 
                            className='expand-text'
                            onClick={() => setMore(!more)}
                        >
                            { more ? "Less" : "More"}
                        </span>

                        <span>{moment(createdAt).format('LT')} &middot; <i className="uil uil-volume-up" onClick={() => speak({ text: message })}></i></span>
                    </div>
                    <div className={more ? "userDetails active": "userDetails"}>
                        <div className="user-name">
                            <span>{user.fName}</span>
                            <i className="uil uil-exclamation-circle spam"></i>
                        </div>
                        <div className="user-contact">
                            <span>{user.mno}</span>
                            <i className="uil uil-phone phone"></i>
                        </div>
                        <div className="user-area">
                            <span>{user.area}</span>
                            <i className="uil uil-estate house"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div></div>
        </div>
    );
}

export default Message

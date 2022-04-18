import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"

import { useSpeechSynthesis } from 'react-speech-kit';
import moment from 'moment';

import './Chat.css';

const data = [
    {id: 1, username: 'Rajesh', message: "Hello Peter", date: new Date().getTime()},
    {id: 2, username: 'Bot', message: "Varenda", date: new Date().getTime()},
    {id: 3, username: 'Rajesh', message: "Hello Peter", date: new Date().getTime()},
    {id: 4, username: 'Rajesh', message: "Varenda", date: new Date().getTime()},
    {id: 5, username: 'Bot', message: "Hello Peter", date: new Date().getTime()},
    {id: 6, username: 'Rajesh', message: "Varenda", date: new Date().getTime()},
    {id: 7, username: 'Bot', message: "Hello Peter", date: new Date().getTime()},
    {id: 8, username: 'Rajesh', message: "Leaner Meaner St", date: new Date().getTime()},
    {id: 9, username: 'Rajesh', message: "Varenda", date: new Date().getTime()},
    {id: 10, username: 'Bot', message: "Hello Peter", date: new Date().getTime()},
    {id: 11, username: 'Bot', message: "Hello Peter", date: new Date().getTime()},
    {id: 12, username: 'Bot', message: "Hello Peter", date: new Date().getTime()},
    {id: 13, username: 'Rajesh', message: "Varenda", date: new Date().getTime()},
    {id: 14, username: 'Rajesh', message: "Varenda", date: new Date().getTime()},
]

console.log(data);

const Chat = () => {
    const { speak } = useSpeechSynthesis();
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();

    console.log(user);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(data);
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        if(!user){
            navigate('/signup')
        }
    }, [])

    const submitHandler = (e) => {
        e.preventDefault();
        const newMessage = {
            id: messages.length+1,
            username: "Rajesh",
            message: message
        }

        setMessages([...messages, newMessage]);
        setMessage('');
    }

    return  (
        <div className="chat">
            <div className="container">
                <header>
                    <p>You: <span>{user.fName}</span></p>
                    <div className="right">
                        <input type="date" min="2022-04-18" max="2022-04-25" name='date' id='date' className='date' />
                        <button>Logout</button>
                    </div>
                </header>
                <div className="content">
                    <div className="messages">
                        {
                            messages.map(({id, username, message}, date) => {
                                if(username == "Rajesh") {
                                    return (
                                        <div className="message right" key={id}>
                                            <div></div>
                                            <div className='msg'>
                                                <div className='msg-text'>
                                                    <p>{message}</p>
                                                    <span>{moment(date).format('LT')} &middot; <i className="uil uil-volume-up" onClick={() => speak({ text: message })}></i></span>
                                                </div>
                                                <span className='msg-profile'>{username[0]}</span> 
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className="message left" key={id}>
                                            <div className='msg'>
                                                <span className='msg-profile'>{username[0]}</span> 
                                                <div className='msg-text'>
                                                    <p>{message}</p>
                                                    <span>{moment(date).format('LT')} &middot; <i className="uil uil-volume-up" onClick={() => speak({ text: message })}></i></span>
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
                    <div className="send">
                        <div className="type">
                            <select name="message" id="message">
                                <option value="Query">Query</option>
                                <option value="Request">Request</option>
                            </select>
                        </div>
                        <div className="type-msg">
                            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Write a message...' />
                            <button onClick={submitHandler}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
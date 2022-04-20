import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"

import Alert from './Alert';
import Message from './Message';
import { logoutHandler, updateUserIsVerified } from '../../app/user/userSlice';

import './Chat.css';

const Chat = () => {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        if(!user) return;
        const responce = await fetch("http://localhost:8080/user/messages", {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

        const result = await responce.json();
        if(responce.status != 200) {
            handleLogout();
        } else {
            const newMessages = result.data.messages;
            setMessages(newMessages);

            if(!user.isVerified) {
                const isVerified = result.data.isVerified;
                dispatch(updateUserIsVerified(isVerified));
            }
        }
    }

    useEffect(()=>{
        fetchData();
    }, []);

    useEffect(() => {
        if(!user){
            navigate('/signin')
        }
    }, [])

    const submitHandler = (e) => {
        e.preventDefault();

        console.log(message);
        // const newMessage = {
        //     id: messages.length+1,
        //     username: "Rajesh",
        //     message: message
        // }

        // setMessages([...messages, newMessage]);
        // setMessage('');
    }

    const handleLogout = () => {
        dispatch(logoutHandler());
        navigate('/signin');
    }

    const toDate = new Date().toISOString().slice(0, 10);

    return  (
        <>
            <Alert isVerified={user && user.isVerified} />
            <div className="chat">
                <div className="container">
                    <header>
                        <p>You: <span>{user && user.fName}</span></p>
                        <div className="right">
                            <input type="date" min="2022-04-18" max={toDate} name='date' id='date' className='date' />
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </header>
                    <div className="content">
                        <Message messages={messages} />
                        <div className="send">
                            <div className="type">
                                <select name="message" id="message">
                                    <option value="Query">Query</option>
                                    <option value="Request">Request</option>
                                </select>
                            </div>
                            <div className="type-msg">
                                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Write a message...' />
                                <button className={user && user.isVerified==0 ? 'disable': ''} onClick={submitHandler}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;
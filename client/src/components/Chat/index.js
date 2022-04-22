import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"

import Alert from './Alert';
import Message from './Message';
import { logoutHandler, updateUserIsVerified } from '../../app/user/userSlice';

import './Chat.css';
import Send from './Send';

const Chat = () => {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const [messages, setMessages] = useState({});

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('Query');
    
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

    return  (
        <>
            <Alert isVerified={user && user.isVerified} />
            <div className="chat">
                <div className="container">
                    <header>
                        <p>You: <span>{user && user.fName}</span></p>
                        <div className="right">
                            <i className="uil uil-redo refresh-icon"></i>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </header>
                    <div className="content">
                        <Message messages={messages} />
                        <Send 
                            messageType={messageType} 
                            setMessageType={setMessageType} 
                            message={message} 
                            setMessage={setMessage} 
                            user={user} 
                            submitHandler={submitHandler}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;
import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"

import Alert from './Alert';
import Message from './Message';
import { logoutHandler, updateUserIsVerified } from '../../app/reducers/userSlice';

import './Chat.css';
import Send from './Send';

const Chat = () => {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const [messages, setMessages] = useState({});

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('Query');
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        if(!user || user.type=="official") return;
        setLoading(true);
        const responce = await fetch("http://localhost:8080/user/messages", {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

        const result = await responce.json();

        setLoading(false);
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


    useEffect(() => {        
        if(!user) {
            navigate("/signin");
        }

        if(user && user.type === "official"){
            navigate('/dashboard')
        }
    }, []);

    useEffect(()=>{
        fetchData();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = {
            message: message,
            type: messageType
        };

        const responce = await fetch("http://localhost:8080/user/addMessage", {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(formData),
                            });

        const result = await responce.json();

        console.log(result);
        if(responce.status != 200) {
            handleLogout();
        } else {
            const newMessages = result.data.messages;
            setMessages(newMessages);
            setMessage('');
        }
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
                            <i className="uil uil-redo refresh-icon" onClick={fetchData}></i>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </header>
                    <div className="content">
                        <Message messages={messages} loading={loading} />
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
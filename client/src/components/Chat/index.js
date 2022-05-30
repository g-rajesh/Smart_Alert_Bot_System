import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {FiSend} from 'react-icons/fi'

import Messages from './Messages';
import Profile from './Profile';
import { logoutHandler, updateUserIsVerified } from '../../app/reducers/userSlice';
import Warning from './Warning';

const Chat = () => {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [toggleUpDown, setToggleUpDown] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        if(!user || user.type=="official") return;
        setLoading(true);
        const responce = await fetch("http://localhost:8080/user/messages", {
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
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

            if(user.isVerified === 0) {
                setToggleUpDown(true);
            }

            if(!user.isVerified) {
                const isVerified = result.data.isVerified;
                dispatch(updateUserIsVerified(isVerified));
            }
        }
    }
    
    useEffect(()=>{
        fetchData();
    }, []);
    
    useEffect(()=>{
        document.title = "TNEB | Chat";
    }, []);

    useEffect(() => {        
        if(!user) {
            navigate("/signin");
        }

        if(user && user.type === "official"){
            navigate('/dashboard')
        }
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = { message };

        const responce = await fetch("http://localhost:8080/user/addMessage", {
                                method: "POST",
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
                                    "Authorization": `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(formData),
                            });

        const result = await responce.json();

        // console.log(result);
        if(responce.status != 200) {
            handleLogout();
        } else {
            if(result.data.isSpam) {
                setShowWarning(true);
            } else {
                const newMessages = result.data.messages;
                setMessages(newMessages);
                setMessage('');
            }
        }
    }
    
    const handleLogout = () => {
        dispatch(logoutHandler());
        navigate('/signin');
    }

    return (
        <>
            {showWarning && <Warning message={message} setShowWarning={setShowWarning} />}
            <section className="chat" id="chat">
                <div className="chat-container">
                    <div className="left">
                        <Messages messages={messages} loading={loading} setToggleUpDown={setToggleUpDown} />
                        
                        <form className="send-msg" onSubmit={submitHandler}>
                            <input 
                                type="text" 
                                value={message}
                                onChange={(e)=>setMessage(e.target.value)}
                                placeholder='Write a message...' 
                            />
                            <FiSend className={!message || (user && user.isVerified==0) ? 'send-icon disable': 'send-icon'}  onClick={submitHandler} />
                        </form>
                    </div>
                    <div className={toggleUpDown ? "right active" : "right"}>
                        <Profile setToggleUpDown={setToggleUpDown} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Chat
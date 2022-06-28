import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {FiSend} from 'react-icons/fi'

import Messages from './Messages';
import Profile from './Profile';
import { FETCH_USER_FEEDBACKS, ADD_USER_FEEDBACKS } from "../../Util/links";
import { logoutHandler, updateUserIsVerified } from '../../app/reducers/userSlice';

const Feedback = () => {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);
    const [toggleUpDown, setToggleUpDown] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        if(!user || user.type=="official") return;
        setLoading(true);
        const responce = await fetch(FETCH_USER_FEEDBACKS, {
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
            setMessages(result);
        }
    }
    
    useEffect(()=>{
        fetchData();
    }, []);

    
    useEffect(()=>{
        document.title = "TNEB | Feedback";
    }, []);

    useEffect(()=>{
        if(localStorage.getItem("feedback")) {
            setMessage(JSON.parse(localStorage.getItem("feedback")));
            localStorage.removeItem("feedback");
        }
    }, []);

    useEffect(() => {        
        if(!user) {
            navigate("/signin");
        }
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();

        const responce = await fetch(ADD_USER_FEEDBACKS, {
                                method: "POST",
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
                                    "Authorization": `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({message}),
                            });

        const result = await responce.json();

        if(responce.status != 200) {
            handleLogout();
        } else {
            setMessages(result);
            setMessage('');
        }
    }

    
    const handleLogout = () => {
        dispatch(logoutHandler());
        navigate('/signin');
    }

    return (
        <>
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

export default Feedback
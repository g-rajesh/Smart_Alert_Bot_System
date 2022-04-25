import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"

import Alert from './Alert';
import Message from './Message';
import { logoutHandler, updateUserIsVerified } from '../../app/reducers/userSlice';

import './Feedback.css';
import Send from './Send';

const Feedback = () => {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const [messages, setMessages] = useState({});

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        if(!user) return;
        console.log("Called");
        setLoading(true);
        const responce = await fetch("http://localhost:8080/user/getFeedback", {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

        const result = await responce.json();

        setLoading(false);
        if(responce.status != 200) {
            handleLogout();
        } else {
            console.log(result);
            setMessages(result);
        }
    }


    useEffect(() => {        
        if(!user) {
            navigate("/signin");
        }
    }, []);

    useEffect(()=>{
        fetchData();
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();

        console.log(message);

        const responce = await fetch("http://localhost:8080/user/addFeedback", {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({message}),
                            });

        const result = await responce.json();

        console.log(result);
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

    return  (
        <>
            <Alert isVerified={user && user.isVerified} />
            <div className="feedback">
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

export default Feedback;
import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"

import Message from './Message';
import { logoutHandler, updateUserIsVerified } from '../../app/user/userSlice';

import './Dashboard.css';

const Dashboard = () => {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    
    const [messages, setMessages] = useState({});
    const [toggle, setToggle] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        if(!user) return;
        const responce = await fetch("http://localhost:8080/user/adminMessages", {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

        const result = await responce.json();
        if(responce.status != 200) {
            handleLogout();
        } else {
            const newMessages = result.data.messages;
            // console.log(newMessages);
            setMessages(newMessages);
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

    const handleLogout = () => {
        dispatch(logoutHandler());
        navigate('/signin');
    }

    return  (
        <div className="dashboard">
            <div className="container">
                <header>
                    <p>You: <span>{user && user.fName}</span></p>
                    <div className="right">
                        <i className="uil uil-redo refresh-icon"></i>
                        <i 
                            className={toggle ? "uil uil-angle-down down-icon active": "uil uil-angle-down down-icon"} 
                            onClick={()=>setToggle(!toggle)}
                        ></i>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </header>
                <section className={toggle ? 'filter active' : 'filter'}>
                    <span className='active'>Chat</span>
                    <span>Call</span>
                    <span>Status</span>
                    <span>Info</span>
                </section>
                <Message messages={messages} toggle={toggle} />
            </div>
        </div>
    );
}

export default Dashboard;
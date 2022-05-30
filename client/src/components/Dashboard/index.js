import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {FiSend} from 'react-icons/fi'

import Messages from './Messages';
import Profile from './Profile';
import { logoutHandler, updateUserIsVerified } from '../../app/reducers/userSlice';

const Dashboard = ({socket, rtc}) => {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    const [messages, setMessages] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toggleUpDown, setToggleUpDown] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchData = async () => {
        if(!user || user.type=="user") return;

        setLoading(true);
        const response = await fetch("http://localhost:8080/user/officialMessages", {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

        const result = await response.json();
        // console.log(result);
        setLoading(false);
        if(response.status !== 200) {
            handleLogout();
        } else {
            const newMessages = result.messages;
            setMessages(newMessages);

            console.log(newMessages);

            console.log(result.messages);
        }
    }
    
    useEffect(()=>{
        document.title = "TNEB | Dashboard";
    }, []);
    
    useEffect(()=>{
        fetchData();
    }, []);

    useEffect(() => {        
        if(!user || user.type === "user") {
            navigate("/signin");
        }
    }, []);
    
    const handleLogout = () => {
        dispatch(logoutHandler());
        navigate('/signin');
    }

    return (
        <>
            <section className="dashboard" id="dashboard">
                <div className="dashboard-container">
                    <div className="left">
                        <Messages 
                            messages={messages}
                            setSelectedUser={setSelectedUser} 
                            loading={loading}
                            setToggleUpDown={setToggleUpDown} 
                        />
                    </div>
                    <div className={toggleUpDown ? "right active" : "right"}>
                        <Profile 
                            selectedUser={selectedUser} 
                            setToggleUpDown={setToggleUpDown}
                            user={user}
                            socket={socket}
                            rtc={rtc}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Dashboard;

import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom"

import Messages from './Messages';
import { logoutHandler } from '../../app/reducers/userSlice';

import './Dashboard.css';
import Status from './Status';

const Dashboard = () => {
    const user = useSelector(state => state.user.user);
    const token = useSelector(state => state.user.token);
    
    const [messages, setMessages] = useState({});
    const [filter, setFilter] = useState('Chat');
    const [loading, setLoading] = useState(true);
    
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

            console.log(result.messages);
        }
    }

    useEffect(() => {
        if(!user) {
            navigate("/signin");
        }

        if(user && user.type == "user"){
            navigate('/chat')
        }
    }, []);

    useEffect(()=>{
        fetchData();
    }, []);

    const handleLogout = () => {
        dispatch(logoutHandler());
        navigate('/signin');
    }

    const filterHandler = (filter) => {
        if(filter === "Chat") {
            return <Messages messages={messages} loading={loading} />
        } else if(filter === "Status") {
            return <Status handleLogout={handleLogout} />
        }

        return null;
    }

    return  (
        <div className="dashboard">
            <div className="container">
                <header>
                    <p>You: <span>{user && user.fName}</span></p>
                    <div className="right">
                        <i className="uil uil-redo refresh-icon" onClick={fetchData}></i>
                        <select 
                            name="filter" 
                            id="filter" 
                            className='filter-type' 
                            value={filter} 
                            onChange={(e)=>setFilter(e.target.value)}
                        >
                            <option value="Chat">Chat</option>
                            <option value="Status">Status</option>
                        </select>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </header>
                {
                    filterHandler(filter)
                }
            </div>
        </div>
    );
}

export default Dashboard;
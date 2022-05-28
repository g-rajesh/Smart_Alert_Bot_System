import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom"
import { FaBars, FaTimes } from 'react-icons/fa'

import { logoutHandler } from '../../app/reducers/userSlice';

const links = {
    "initial": [
        { to: "/",  link: "Home" },
        { to: "/chat",  link: "Chat" },
        { to: "/feedback",  link: "Feedback" },
        { to: "/signin",  link: "Sign In" },
        { to: "/signup",  link: "Sign Up" },
    ],
    "user": [
        { to: "/",  link: "Home" },
        { to: "/chat",  link: "Chat" },
        { to: "/feedback",  link: "Feedback" },
        { to: "/signin",  link: "Sign In" },
    ]
}

const Navbar = () => {
    const user = useSelector(state => state.user.user);
    const [toggle, setToggle] = useState(false);

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutHandler());
    }

    const clickHandler = () => {
        setToggle(!toggle);
    }

    const navLink = () => {
        let type = "initial";
        if(user && user.type === "user") type = "user";
        if(user && user.type === "official") type = "official";
        switch(type) {
            case "initial":
                return (
                    <>
                        <li><NavLink onClick={clickHandler} to="/">Home</NavLink></li>
                        <li><NavLink onClick={clickHandler} to="/chat">Chat</NavLink></li>
                        <li><NavLink onClick={clickHandler} to="/feedback">Feedback</NavLink></li>
                        <li><NavLink onClick={clickHandler} to="/signin">Sign In</NavLink></li>
                        <li><NavLink onClick={clickHandler} to="/signup">Sign Up</NavLink></li>
                    </>
                )
            case "user":
                return (
                    <>
                        <li><NavLink onClick={clickHandler} to="/">Home</NavLink></li>
                        <li><NavLink onClick={clickHandler} to="/chat">Chat</NavLink></li>
                        <li><NavLink onClick={clickHandler} to="/feedback">Feedback</NavLink></li>
                        <li onClick={handleLogout}><NavLink to="/signin">Logout</NavLink></li>
                    </>
                )
            case "official":
                return (
                    <>
                        <li><NavLink onClick={clickHandler} to="/">Home</NavLink></li>
                        <li><NavLink onClick={clickHandler} to="/dashboard">Dashboard</NavLink></li>
                        <li><NavLink onClick={clickHandler} to="/status">Status</NavLink></li>
                        <li onClick={handleLogout}><NavLink to="/signin">Logout</NavLink></li>
                    </>
                )
        }
    }

    return (
        <header>
            <div className="logo">
                <h2>TNEB</h2>
            </div>
            <nav className={toggle ? 'nav nav-active' : 'nav'}>
                <ul className='nav-links'>
                    { navLink() }
                </ul>
            </nav>

            <div className="toggle">
                {
                    toggle ? (
                        <FaTimes className='times-icon' onClick={()=>setToggle(false)} />
                    ) : (
                        <FaBars className='bar-icon' onClick={()=>setToggle(true)} />
                    )
                }
            </div>
        </header>
    )
}

export default Navbar
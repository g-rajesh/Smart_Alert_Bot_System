import React from 'react'
import {Link} from 'react-router-dom'

import illustration from '../../images/illustration.jpg';

import './Home.css';
const Home = () => {
  return (
    <div className="home">
        <header>
            <h2>TNEB</h2>
            <div className="right">
                <button className='btn btn1'><Link to="/signin">Sign in</Link></button>
                <button className='btn btn2'><Link to="/signup">Sign up</Link></button>
            </div>
        </header>
        <div className="container">
            <div className="left">
                <h2>Smart Alert Bot System</h2>
                <div className="question">
                    <div className="query">
                        <i className="uil uil-battery-bolt query-icon"></i>
                        <span>Query</span>
                        <p>You can raise a query in the chat if you don't have power in your area</p>
                    </div>
                    <div className="request">
                        <i className="uil uil-bolt-slash req-icon"></i>
                        <span>Request</span>
                        <p>You can request to cut the power in your area in case of emergency</p>
                    </div>
                </div>
                <div className="btns">
                    <Link to="/chat">Chat</Link>
                    <Link to="/feedback">Feedback</Link>
                </div>
            </div>
            <div className="right">
                <img src={illustration} alt="illustration" />
            </div>
        </div>
    </div>
  )
}

export default Home
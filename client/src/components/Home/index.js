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
                <h2>Lorem ipsum dolor sit amet<br />consectetur adipisicing elit.</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident dolorum optio at in commodi quibusdam aspernatur? Cupiditate eveniet repellat ipsa?</p>
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
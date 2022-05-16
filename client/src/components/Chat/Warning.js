import React from 'react'
import {RiErrorWarningLine} from 'react-icons/ri'
import { NavLink } from 'react-router-dom'

const Warning = ({message, setShowWarning}) => {

    const addFeedback = () => {
        localStorage.setItem("feedback", JSON.stringify(message));
    }

    return (
        <div className='warning'>
            <div className="warning-msg">
                <span className='f1'><RiErrorWarningLine className='warning-icon' /> Spam</span>
                <p>Your message has been marked as spam by our application. Please send valid message!</p>
                <div className="warning-btns">
                    <button onClick={() => setShowWarning(false)}>Cancel</button>
                    <NavLink to="/feedback" onClick={addFeedback}>Feedback</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Warning
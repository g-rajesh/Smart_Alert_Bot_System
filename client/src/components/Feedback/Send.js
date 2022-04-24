import React from 'react'

const Send = ({message, setMessage, user, submitHandler}) => {
    return (
        <div className="sendFeedback">
            <div>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Write a message...' />
                <button className={!message || (user && user.isVerified==0) ? 'disable': ''} onClick={submitHandler}>Send</button>
            </div>
        </div>
    )
}

export default Send
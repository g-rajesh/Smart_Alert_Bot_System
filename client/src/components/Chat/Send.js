import React from 'react'

const Send = ({messageType, setMessageType, message, setMessage, user, submitHandler}) => {
    console.log(user);
    return (
        <div className="send">
            <div className="type">
                <select name="message" id="message" value={messageType} onChange={(e)=> setMessageType(e.target.value)}>
                    <option value="Query">Query</option>
                    <option value="Request">Request</option>
                </select>
            </div>
            <div className="type-msg">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Write a message...' />
                <button className={!message || (user && user.isVerified==0) ? 'disable': ''} onClick={submitHandler}>Send</button>
            </div>
        </div>
    )
}

export default Send
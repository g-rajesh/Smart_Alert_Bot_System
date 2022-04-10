import React from 'react';
import './Chat.css';

const messages = [
    {id: 1, username: 'Rajesh', message: "Hello Peter"},
    {id: 2, username: 'Bot', message: "Varenda"},
    {id: 3, username: 'Rajesh', message: "Hello Peter"},
    {id: 4, username: 'Rajesh', message: "Varenda"},
    {id: 5, username: 'Bot', message: "Hello Peter"},
    {id: 6, username: 'Rajesh', message: "Varenda"},
    {id: 7, username: 'Bot', message: "Hello Peter"},
    {id: 8, username: 'Rajesh', message: "Varenda"},
    {id: 9, username: 'Rajesh', message: "Varenda"},
    {id: 10, username: 'Bot', message: "Hello Peter"},
    {id: 11, username: 'Bot', message: "Hello Peter"},
    {id: 12, username: 'Bot', message: "Hello Peter"},
    {id: 13, username: 'Rajesh', message: "Varenda"},
    {id: 14, username: 'Rajesh', message: "Varenda"},
]

const Chat = () => {
    return  (
        <div className="chat">
            <div className="container">
                <header>
                    <p>You: <span>G Rajesh</span></p>
                    <div className="right">
                        {/* <input type="date" /> */}
                        <button>Logout</button>
                    </div>
                </header>
                <div className="content">
                    <div className="messages">
                        {
                            messages.map(({id, username, message}) => {
                                if(username == "Rajesh") {
                                    return <div className="message" key={id}>
                                        <div className="left"></div>
                                        <div className="right msg">{message}</div>
                                    </div>
                                } else {
                                    return <div className="message" key={id}>
                                        <div className="left msg">{message}</div>
                                        <div className="right"></div>
                                    </div>
                                }
                            })
                        }
                    </div>
                    <div className="send">
                        <div className="type">
                            <select name="message" id="message">
                                <option value="Query">Query</option>
                                <option value="Request">Request</option>
                            </select>
                        </div>
                        <div className="type-msg">
                            <input type="text" placeholder='Write a message...' />
                            <button>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
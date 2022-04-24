import React, {useState} from 'react'

const Alert = ({isVerified}) => {
    const [clicked, setClicked] = useState(false);

    let classes = 'alert';
    if(!clicked && isVerified == 0) classes += ' display';
    return (
        <p className={classes}>Please, verify your account to send message! &nbsp;<a href='https://www.gmail.com'>Click here</a> &nbsp; <i className="uil uil-times times-icon" onClick={()=>setClicked(true)}></i></p>
    );
}

export default Alert
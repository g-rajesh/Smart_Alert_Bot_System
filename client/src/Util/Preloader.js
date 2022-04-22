import React from 'react'
import './Preloader.css';

const Preloader = ({text}) => {
    return (
        <div className='preloader'>
            <div className="content">
                <span>{text}</span>
                <div className="loader"></div>
            </div>
        </div>
    )
}

export default Preloader;
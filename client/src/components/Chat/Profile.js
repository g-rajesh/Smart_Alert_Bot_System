import React from 'react'
import { useSelector } from 'react-redux';

import { FaPhoneAlt, FaHome, FaTimes, FaChevronRight } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'

const Profile = ({setToggleUpDown}) => {
    const user = useSelector(state => state.user.user);

    return (
        <div className="profile">
            <div className="tp">
                <span>{user && user.fName[0]}</span>
                <div className="pf">
                    <p>{user && user.fName}</p>
                    {
                        user && user.isVerified ? (
                            <span className="success">Verified</span>
                        ) : (
                            <div className='verifier'>
                                <span className="error">Not Verified</span>
                                <FaChevronRight className='right-icon' />
                                <a href="https://www.gmail.com">Verify here</a>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="bt">
                <p><FaPhoneAlt className='bt-icon phone-icon' /> {user && user.mno}</p>
                <p><MdAlternateEmail className='bt-icon email-icon' /> {user && user.email}</p>
                <p><FaHome className='bt-icon home-icon' /> {user && user.area}</p>
                {/* <span className='attend-call'>Join call</span> */}
            </div>
            <div className="close" onClick={()=>setToggleUpDown(false)}><FaTimes className='close-icon' /></div>
        </div>
    )
}

export default Profile
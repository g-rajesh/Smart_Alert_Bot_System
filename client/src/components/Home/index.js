import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { changeHandler } from '../../app/reducers/signupSlice';
import image from "../../images/electricity.jpg"

import { BsSearch, BsQuestionCircle } from 'react-icons/bs';

// import { GrCircleInformation } from 'react-icons/gr';
import { IoMdInformationCircleOutline, IoIosGitPullRequest } from 'react-icons/io'

const Home = () => {
    const formData = useSelector((state) => state.signup.formDetails);
    const dispatch = useDispatch();

    useEffect(()=>{
        document.title = "TNEB | Home";
    }, []);

    const handleChange = (e) => {
        const payload = {
            'name': e.target.name,
            'value': e.target.value
        }
        dispatch(changeHandler(payload));
    }

    return (
        <section className="home" id="home">
            <div className="home-container">
                <div className="left">
                    <h2>Smart Alert Bot System</h2>
                    
                    <p>An idea to provide information about the power cut and the resumption of power supply to the people in an area. This application will be used as a mediator between TNEB official and people where users can either raise one of the following</p>
                    <div className="list">
                        <p><BsSearch className='inquiry-icon ic' /><span> Inquire</span></p>
                        <p><BsQuestionCircle className='query-icon ic' /><span> Query</span></p>
                        <p><IoMdInformationCircleOutline className='inform-icon ic' /><span> Inform</span></p>
                        <p><IoIosGitPullRequest className='request-icon ic' /><span> Request</span></p>
                    </div>
                    <div className="reg-form">
                        <input 
                            type="email" 
                            name='email' 
                            id="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                        <NavLink className='btn' to="/signup">Register</NavLink>
                    </div>
                </div>
                <div className="right">
                    <img src={image} alt="illustration" className='image' />
                </div>
            </div>
        </section>
    )
}

export default Home
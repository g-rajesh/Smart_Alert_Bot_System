import React from 'react';
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import { changeError, deleteError, submitHandler } from '../../../app/signup/signupSlice';

import Account from './Account';
import Personal from './Personal';
import "./SignUp.css";
import { updateUser } from '../../../app/user/userSlice';

const SignUp = () => {
    // TODO
    // ONCE USER ENTERS THE DETAILS, REMOVE THE ERROR MESSAGE

    const formDetails = useSelector((state) => state.signup.formDetails);
    const currPage = useSelector((state) => state.signup.currPage);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(deleteError);
        
        const responce = await fetch("http://localhost:8080/user/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formDetails),
        });

        const result = await responce.json();
        if(responce.status == 500) {
            dispatch(changeError(result.data));
        } else {
            dispatch(submitHandler());
            dispatch(updateUser(result));
            navigate('/chat');
        }
        console.log(result);
    }
    
    return  (
        <div className="auth">
            <div className="container">
                <h2>TNEB</h2>
                <div className="form">
                    <h2>Sign up</h2>
                    <form>
                    {
                        currPage == 1 ? <Account /> : <Personal handleSubmit={handleSubmit} />
                    }
                    </form>
                    
                    <p className="toggle">Already a user? <Link to="/signin">Sign In here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;


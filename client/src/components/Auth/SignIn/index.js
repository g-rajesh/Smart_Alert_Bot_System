import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';

import { changeHandler, submitHandler } from '../../../app/signin/signinSlice';
import { Input } from '../../../util/Input';

import "./SignIn.css";

const SignIn = () => {
    const formData = useSelector((state) => state.signin.formDetails);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(submitHandler());
    }

    return  (
        <div className="auth">
            <div className="container">
                <h2>TNEB</h2>
                <div className="form">
                    <h2>Sign In</h2>
                    <form>
                        <Input
                            name="email"
                            type="email"
                            label="Email"
                            className={formData.email ? 'active': ''}
                            value={formData.email}
                            changeHandler={changeHandler}
                        />

                        <Input
                            name="password"
                            type="password"
                            label="Password"
                            className={formData.password ? 'active': ''}
                            value={formData.password}
                            changeHandler={changeHandler}
                        />
                        <div className='btn-class'>
                            <button className="btn" onClick={handleSubmit}>Sign In</button>
                        </div>
                    </form>
                    
                    <p className="toggle">New User? <Link to="/signup">Create account here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;


import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateOfficial } from '../../../app/reducers/officialSlice';

import { changeHandler, deleteError, changeError, submitHandler } from '../../../app/reducers/signinSlice';
import { updateUser } from '../../../app/reducers/userSlice';
import { Input } from '../../../Util/Input';
import Preloader from '../../../Util/Preloader';

import "./SignIn.css";

const SignIn = () => {
    const formData = useSelector((state) => state.signin.formDetails);
    const error = useSelector(state => state.signin.error);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        dispatch(deleteError());

        const responce = await fetch("http://localhost:8080/user/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const result = await responce.json();

        setLoading(false);
        if(responce.status == 500) {
            dispatch(changeError(result.data));
        } else {
            dispatch(submitHandler());

            if(result.data.type === "user") {
                dispatch(updateUser(result));
                navigate('/chat');
            } else {
                dispatch(updateOfficial(result));
                navigate('/dashboard');
            }
        }
        // console.log(result);
    }

    const classes = { "email": "", "password": "" };
    if(formData.email != "") classes.email += "active ";
    if(error.email != "") classes.email += "error";
    
    if(formData.password != "") classes.password += "active ";
    if(error.password != "") classes.password += "error";

    return  (
        <>
            { loading && <Preloader text="Authenticating user..." /> }
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
                                className={classes.email}
                                value={formData.email}
                                error={error.email}
                                changeHandler={changeHandler}
                            />

                            <Input
                                name="password"
                                type="password"
                                label="Password"
                                className={classes.password}
                                value={formData.password}
                                error={error.password}
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
        </>
    );
}

export default SignIn;


import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { changeHandler, deleteError, changeError, submitHandler } from '../../../app/signin/signinSlice';
import { updateUser } from '../../../app/user/userSlice';
import { Input } from '../../../Util/Input';

import "./SignIn.css";

const SignIn = () => {
    const formData = useSelector((state) => state.signin.formDetails);
    const error = useSelector(state => state.signin.error);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        dispatch(deleteError());

        const responce = await fetch("http://localhost:8080/user/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
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

    const classes = { "email": "", "password": "" };
    if(formData.email != "") classes.email += "active ";
    if(error.email != "") classes.email += "error";
    
    if(formData.password != "") classes.password += "active ";
    if(error.password != "") classes.password += "error";

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
    );
}

export default SignIn;


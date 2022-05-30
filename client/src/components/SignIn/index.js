import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { changeHandler, deleteError, changeError, submitHandler } from '../../app/reducers/signinSlice';
import { updateUser } from '../../app/reducers/userSlice';
import { Input } from '../../Util/Input';
import Preloader from '../../Util/Preloader';

const SignIn = () => {
    const user = useSelector(state => state.user.user);

    const formData = useSelector((state) => state.signin.formDetails);
    const error = useSelector(state => state.signin.error);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(user && user.type == "official") {
            navigate('/dashboard');
        }
        if(user && user.type == "user") {
            navigate('/chat');
        }
    }, []);

    useEffect(()=>{
        document.title = "TNEB | Sign In";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        dispatch(deleteError());

        const responce = await fetch("http://localhost:8080/user/signin", {
            method: "POST",
            headers: {
                // "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const result = await responce.json();
        console.log('result: ', result)
        setLoading(false);
        if(responce.status == 500) {
            dispatch(changeError(result.data));
        } else {
            dispatch(submitHandler());
            
            dispatch(updateUser(result));
            if(result.data.type === "user") {
                navigate('/chat');
            } else {
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
            <section className="signin" id="signin">
                <div className="signin-container">
                    <div className="form">
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
                        
                        <p className="toggler">New User? <Link to="/signup">Create account here</Link></p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default SignIn;

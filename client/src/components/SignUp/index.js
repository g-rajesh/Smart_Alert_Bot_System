import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import Account from './Account'
import Personal from './Personal'
import Preloader from '../../Util/Preloader';

import { changeError, deleteError, submitHandler } from '../../app/reducers/signupSlice';
import { updateUser } from '../../app/reducers/userSlice';

const SignUp = () => {
    const user = useSelector(state => state.user.user);

    const formDetails = useSelector((state) => state.signup.formDetails);
    const currPage = useSelector((state) => state.signup.currPage);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(user && user.type === "official") {
            navigate('/dashboard');
        }
        if(user && user.type === "user") {
            navigate('/chat');
        }
    }, []);
    
    useEffect(()=>{
        document.title = "TNEB | Sign Up";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        dispatch(deleteError);
        
        const responce = await fetch("http://localhost:8080/user/signup", {
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDetails),
        });

        const result = await responce.json();

        setLoading(false);
        if(responce.status == 500) {
            dispatch(changeError(result.data));
        } else {
            dispatch(submitHandler());
            dispatch(updateUser(result));
            navigate('/chat');
        }
        console.log(result);
    }

    return (
        <>
            { loading && <Preloader text="Creating account for you. Please wait..." /> }
            <section className="signup" id="signup">
                <div className="signup-container">
                    <div className="form">
                        <form>
                        {
                            currPage == 1 ? <Account /> : <Personal handleSubmit={handleSubmit} />
                        }
                        </form>
                        
                        <p className="toggler">Already a user? <NavLink to="/signin">Sign In here</NavLink></p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignUp
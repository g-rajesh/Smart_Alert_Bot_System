import React from 'react';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom';

import Account from './Account';
import Personal from './Personal';
import "./SignUp.css";

const SignUp = () => {
    const currPage = useSelector((state) => state.signup.currPage);
    
    return  (
        <div className="auth">
            <div className="container">
                <h2>TNEB</h2>
                <div className="form">
                    <h2>Sign up</h2>
                    <form>
                    {
                        currPage == 1 ? <Account /> : <Personal />
                    }
                    </form>
                    
                    <p className="toggle">Already a user? <Link to="/signin">Sign In here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;


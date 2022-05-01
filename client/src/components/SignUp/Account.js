import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { changePageHandler, changeHandler } from '../../app/reducers/signupSlice';

import { Input } from '../../Util/Input';

const Account = () => {
    const formData = useSelector((state) => state.signup.formDetails);
    const error = useSelector((state) => state.signup.error);
    const currPage = useSelector((state) => state.signup.currPage);


    const classes = { "fName": "", "lName": "", "email": "", "password": "" }
    if(formData.fName != "") classes.fName += "active ";
    if(error.fName != "") classes.fName += "error";
    
    if(formData.lName != "") classes.lName += "active ";
    if(error.lName != "") classes.lName += "error";
    
    if(formData.email != "") classes.email += "active ";
    if(error.email != "") classes.email += "error";
    
    if(formData.password != "") classes.password += "active ";
    if(error.password != "") classes.password += "error";

    const dispatch = useDispatch();

    return (
        <div className='account-form'>
            <p className="tag">ACCOUNT INFO</p>
            <div className="grid">
                <Input
                    name="fName"
                    type="text"
                    label="First Name"
                    className={classes.fName}
                    value={formData.fName}
                    error={error.fName}
                    changeHandler={changeHandler}
                />
                <Input
                    name="lName"
                    type="text"
                    label="Last Name"
                    className={classes.lName}
                    value={formData.lName}
                    error={error.lName}
                    changeHandler={changeHandler}
                />                
            </div>
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
                <button className="btn" onClick={() => dispatch(changePageHandler(currPage+1))}>Next</button>
            </div>
        </div>
    )
}

export default Account

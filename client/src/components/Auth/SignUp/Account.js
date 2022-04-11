import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { changePageHandler, changeHandler } from '../../../app/signup/signupSlice';

import { Input } from '../../../util/Input';

const Account = () => {
    const formData = useSelector((state) => state.signup.formDetails);
    const currPage = useSelector((state) => state.signup.currPage);

    const dispatch = useDispatch();

    return (
        <div className='account-form'>
            <p className="tag">Account Info</p>
            <div className="grid">
                <Input
                    name="fName"
                    type="text"
                    label="First Name"
                    className={formData.fName ? 'active': ''}
                    value={formData.fName}
                    changeHandler={changeHandler}
                />
                <Input
                    name="lName"
                    type="text"
                    label="Last Name"
                    className={formData.lName ? 'active': ''}
                    value={formData.lName}
                    changeHandler={changeHandler}
                />                
            </div>
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
                <button className="btn" onClick={() => dispatch(changePageHandler(currPage+1))}>Next</button>
            </div>
        </div>
    )
}

export default Account

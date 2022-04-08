import React from 'react'
import { Input } from '../../../Util/Input';

const Account = ({currPage, setCurrentPage, formData, changeHandler}) => {

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
                    onChange={changeHandler}
                />
                <Input
                    name="lName"
                    type="text"
                    label="Last Name"
                    className={formData.lName ? 'active': ''}
                    value={formData.lName}
                    onChange={changeHandler}
                />                
            </div>
            <Input
                name="email"
                type="email"
                label="Email"
                className={formData.email ? 'active': ''}
                value={formData.email}
                onChange={changeHandler}
            />

            <Input
                name="password"
                type="password"
                label="Password"
                className={formData.password ? 'active': ''}
                value={formData.password}
                onChange={changeHandler}
            />
            <div className='btn-class'>
                <button className="btn" onClick={() => setCurrentPage(currPage+1)}>Next</button>
            </div>
        </div>
    )
}

export default Account

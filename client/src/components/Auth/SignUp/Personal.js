import React from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { Input, Select } from '../../../util/Input';
import { zones, areas } from '../../../util/data';
import { changePageHandler, changeHandler, submitHandler } from '../../../app/signup/signupSlice';

const Personal = () => {
    const formData = useSelector((state) => state.signup.formDetails);
    const currPage = useSelector((state) => state.signup.currPage);

    const dispatch = useDispatch();

    const cno = Number.isNaN(formData.cno) ? '' : formData.cno;
    const selectedZone = formData.zone;

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(submitHandler());
    }

    return (
        <div className='personal-form'>
            <p className="tag">Personal Info</p>
            <Input
                name="cno"
                type="number"
                label="Consumer Number"
                className={formData.cno ? 'active': ''}
                value={cno}
                changeHandler={changeHandler}
            />
            
            <Select
                name="zone"
                label="Select a zone"
                className={formData.zone ? 'active': ''}
                value={formData.zone}
                changeHandler={changeHandler}
                options={zones}
                optional="Select a zone"
            />

            {
                selectedZone && 
                <Select
                    name="area"
                    label="Select a area"
                    className={formData.area ? 'active': ''}
                    value={formData.area}
                    changeHandler={changeHandler}
                    options={areas[selectedZone]}
                    optional="Select an area"
                />
            }
            
            <div className='btn-class'>
                <button className="btn" onClick={() => dispatch(changePageHandler(currPage-1))}>Previuos</button>
                <button className="btn" onClick={handleSubmit}>Signup</button>
            </div>
        </div>
    )
}

export default Personal;

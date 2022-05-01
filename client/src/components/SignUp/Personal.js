import React from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { Input, Select } from '../../Util/Input';
import { zones, areas } from '../../Util/data';
import { changePageHandler, changeHandler, submitHandler } from '../../app/reducers/signupSlice';

const Personal = ({handleSubmit}) => {
    const formData = useSelector((state) => state.signup.formDetails);
    const error = useSelector((state) => state.signup.error);
    const currPage = useSelector((state) => state.signup.currPage);

    const dispatch = useDispatch();

    const classes = { "mno": "", "zone": "", "area": "" }
    if(formData.mno != "") classes.mno += "active ";
    if(error.mno != "") classes.mno += "error";
    
    if(formData.zone != "") classes.zone += "active ";
    if(error.zone != "") classes.zone += "error";
    
    if(formData.area != "") classes.area += "active ";
    if(error.area != "") classes.area += "error";

    const mno = Number.isNaN(formData.mno) ? '' : formData.mno;
    const selectedZone = formData.zone;

    return (
        <div className='personal-form'>
            <p className="tag">PERSONAL INFO</p>
            <Input
                name="mno"
                type="number"
                label="Mobile Number"
                className={classes.mno}
                value={mno}
                error={error.mno}
                changeHandler={changeHandler}
            />
            
            <Select
                name="zone"
                label="Select a zone"
                className={classes.zone}
                value={formData.zone}
                error={error.zone}
                changeHandler={changeHandler}
                options={zones}
                optional="Select a zone"
            />

            {
                selectedZone && 
                <Select
                    name="area"
                    label="Select a area"
                    className={classes.area}
                    value={formData.area}
                    error={error.area}
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

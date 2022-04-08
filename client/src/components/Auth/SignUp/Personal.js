import React from 'react'

import { Input, Select } from '../../../Util/Input';
import { zones, areas } from '../../../Util/data';

const Personal = ({currPage, setCurrentPage, formData, changeHandler, submitHandler}) => {

    const cno = Number.isNaN(formData.cno) ? '' : formData.cno;
    const selectedZone = formData.zone;

    return (
        <div className='personal-form'>
            <p className="tag">Personal Info</p>
            <Input
                name="cno"
                type="number"
                label="Consumer Number"
                className={formData.cno ? 'active': ''}
                value={formData.cno}
                onChange={changeHandler}
            />
            
            <Select
                name="zone"
                label="Select a zone"
                className={formData.zone ? 'active': ''}
                value={formData.zone}
                onChange={changeHandler}
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
                    onChange={changeHandler}
                    options={areas[selectedZone]}
                    optional="Select an area"
                />
            }
            
            <div className='btn-class'>
                <button className="btn" onClick={() => setCurrentPage(currPage-1)}>Previuos</button>
                <button className="btn" onClick={submitHandler}>Signup</button>
            </div>
        </div>
    )
}

export default Personal;

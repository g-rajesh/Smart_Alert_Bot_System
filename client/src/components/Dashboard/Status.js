import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import { InputWithoutError, SelectWithoutError } from '../../Util/Input'

let initialData = {
    area: '',
    type: '',
    problem: '',
    restoration: ''
}

const Status = (handleLogout) => {
    const token = useSelector(state => state.user.token);

    const [formData, setFormData] = useState(initialData);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const fetchAreas = async () => {
        const response = await fetch("http://localhost:8080/user/getAreas", {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                });

        const result = await response.json();
        console.log(result);
        if(response.status !== 200) {
            handleLogout();
        } else {
            setAreas(["All", ...result.areas])
        }
    }

    useEffect(() => {
        fetchAreas();
    }, []);

    useEffect(() => {
        let timer;
        if(success) {
            timer = setTimeout(() => {
                setSuccess("");
            }, 3000);
        }

        return () => clearTimeout(timer);
    }, [success]);

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        setLoading(true);
        const response = await fetch("http://localhost:8080/user/updateStatus", {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(formData),
                            });

        const result = await response.json();
        setLoading(false);
        if(response.status !== 200) {
            handleLogout();
        } else {
            console.log(result);
            setFormData(initialData);
            setSuccess(result.success);
        }
    }

    let disable = false;
    if(!formData.area || !formData.type) disable=true;
    if(formData.type==='Change' && (!formData.problem || !formData.restoration)) disable=true;

    return (
        <div className="status active">
            <form className='status-update'>
                <SelectWithoutError
                    name="area"
                    label="Area"
                    className={formData.area ? "active": ""}
                    value={formData.area}
                    changeHandler={changeHandler}
                    options={areas}
                    optional="Select a area"
                />
                <SelectWithoutError
                    name="type"
                    label="Type"
                    className={formData.type ? "active": ""}
                    value={formData.type}
                    changeHandler={changeHandler}
                    options={["Back to Default", "Change"]}
                    optional="Select a type"
                />
                {
                    formData.type === "Change" && (
                        <>
                            <InputWithoutError
                                name="problem"
                                type="problem"
                                label="Problem"
                                className={formData.problem ? "active": ""}
                                value={formData.problem}
                                changeHandler={changeHandler}
                            />
                            <InputWithoutError
                                name="restoration"
                                type="restoration"
                                label="Restoration"
                                className={formData.restoration ? "active": ""}
                                value={formData.restoration}
                                changeHandler={changeHandler}
                            />
                        </>
                    )
                }                

                {
                    success && <span className='success-msg'>{success}</span>
                }
                <button className={loading || disable ? 'btn disable': 'btn'} onClick={submitHandler}>Update</button>
            </form>
        </div>
    )
}

export default Status
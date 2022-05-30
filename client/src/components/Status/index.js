import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutHandler } from '../../app/reducers/userSlice';

import { InputWithoutError, SelectWithoutError } from '../../Util/Input'

let initialData = {
    area: '',
    type: '',
    problem: '',
    restoration: ''
}

const Status = () => {
    const token = useSelector(state => state.user.token);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(initialData);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const fetchAreas = async () => {
        const response = await fetch("http://localhost:8080/user/getAreas", {
                                    headers: {
                                        "Access-Control-Allow-Origin": "*",
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

    useEffect(()=>{
        document.title = "TNEB | Status";
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

    const handleLogout = () => {
        dispatch(logoutHandler());
        navigate('/signin');
    }

    const changeHandler = (e) => {
        if(e.target.name === "restoration" && e.target.value < 0) {
            setFormData({...formData, [e.target.name]: 0});
        } else {
            setFormData({...formData, [e.target.name]: e.target.value});
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        console.log(formData);

        setLoading(true);
        const response = await fetch("http://localhost:8080/user/updateStatus", {
                                method: "POST",
                                headers: {
                                    "Access-Control-Allow-Origin": "*",
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
        <section className="signin">
            <div className="signin-container">
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
                                    type="text"
                                    label="Problem"
                                    className={formData.problem ? "active": ""}
                                    value={formData.problem}
                                    changeHandler={changeHandler}
                                />
                                {/* <InputWithoutError
                                    name="restoration"
                                    type="number"
                                    label="Restoration"
                                    className={formData.restoration ? "active": ""}
                                    value={formData.restoration}
                                    changeHandler={changeHandler}
                                /> */}
                                <div className="form-group">
                                    <label htmlFor="restoration">Restoration time in hours</label>
                                    <input type="number" className={formData.restoration ? "active": ""} name="restoration" id="restoration" value={formData.restoration} onChange={changeHandler} autoComplete="off" />
                                </div>
                            </>
                        )
                    }                
                    {
                        success && <span className='success-msg'>{success}</span>
                    }
                    <button className={loading || disable ? 'btn disable': 'btn'} onClick={submitHandler}>Update</button>
                </form>
            </div>
        </section>
    )
}

export default Status
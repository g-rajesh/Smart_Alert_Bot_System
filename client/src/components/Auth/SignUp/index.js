import React, {useState, useEffect} from 'react';

import Account from './Account';
import Personal from './Personal';
import { formDetails } from '../../../Util/data';
import "./SignUp.css";

let data = formDetails;
let page = 1;

if(localStorage.getItem("formData")){
    data = JSON.parse(localStorage.getItem("formData"));
}

if(localStorage.getItem("page")) {
    page = JSON.parse(localStorage.getItem("page"));
}

const SignUp = () => {
    const [currPage, setCurrentPage] = useState(page);
    const [formData, setFormData] = useState(data);

    useEffect(()=>{
        localStorage.setItem("page", JSON.stringify(currPage));
    }, [currPage]);

    const changeHandler = (e) => {
        setFormData(prevData => {
            let newData = {...prevData, [e.target.name]: e.target.value};localStorage.setItem("formData", JSON.stringify(newData));
            return newData;
        });
    }

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(formData);

        setCurrentPage(1);
        localStorage.removeItem("formData");
        setFormData(formDetails);
    }

    // TODO
    // 1. ADD CLASS TO MAKE INPUT ACTIVE -> DONE
    // 2. ADD TEXT STYLE TO INPUT -> DONE
    // 3. STORE THE DETAILS IN LOCAL STORAGE -> DONE
    // 4. MAKE REUSABLE COMPONENTS -> DONE
    // 5. ADD ERROR HANDLER
    // 6. ADD REDUX TOOLKIT -> (Package downloaded, setup has to be done)

    return  (
        <div className="auth">
            <div className="container">
                <h2>TNEB</h2>
                <div className="form">
                    <h2>Sign up</h2>
                    <form>
                    {
                        currPage == 1 ? <Account currPage={currPage} setCurrentPage={setCurrentPage} formData={formData} changeHandler={changeHandler} submitHandler={submitHandler} /> : <Personal currPage={currPage} setCurrentPage={setCurrentPage} formData={formData} changeHandler={changeHandler} submitHandler={submitHandler} />
                    }
                    </form>
                    
                </div>
            </div>
        </div>
    );
}

export default SignUp;


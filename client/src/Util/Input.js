import React from 'react'
import { useDispatch } from 'react-redux';

export const Input = ({name, type, label, className, value, error, changeHandler}) => {
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const payload = {
            'name': e.target.name,
            'value': e.target.value
        }

        dispatch(changeHandler(payload));
    }

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input type={type} className={className} name={name} id={name} value={value} onChange={handleChange} autoComplete="off" />
            {
                error && <span className='error-msg'>{error}</span>
            }
        </div>
    )
}

export const InputWithoutError = ({name, type, label, className, value, changeHandler}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input type={type} className={className} name={name} id={name} value={value} onChange={changeHandler} autoComplete="off" />
        </div>
    )
}

export const Select = ({name, label, className, value, error, changeHandler, options, optional}) => {
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const payload = {
            'name': e.target.name,
            'value': e.target.value
        }

        dispatch(changeHandler(payload));
    }

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select className={className} name={name} id={name} value={value} onChange={handleChange}>
                <option hidden value>{optional}</option>
                {
                    options.map((option, index) => {
                        return <option key={index} value={option}>{option}</option>
                    })
                }
            </select>
            {
                error && <span className='error-msg'>{error}</span>
            }
        </div>
    )
}

export const SelectWithoutError = ({name, label, className, value, changeHandler, options, optional}) => {

    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select className={className} name={name} id={name} value={value} onChange={changeHandler}>
                <option hidden value>{optional}</option>
                {
                    options.map((option, index) => {
                        return <option key={index} value={option}>{option}</option>
                    })
                }
            </select>
        </div>
    )
}
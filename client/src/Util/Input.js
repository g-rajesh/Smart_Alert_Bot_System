export const Input = ({name, type, label, className, value, onChange}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input type={type} className={className} name={name} id={name} value={value} onChange={onChange} autoComplete="off" />
        </div>
    )
}

export const Select = ({name, label, className, value, onChange, options, optional}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select className={className} name={name} id={name} value={value} onChange={onChange}>
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
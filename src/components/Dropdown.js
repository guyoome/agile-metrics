import React, { useEffect, useState } from 'react';

import './Dropdown.css';

function Dropdown(props) {
    const [options, setOptions] = useState([]);
    const [placeholder, setPlaceholder] = useState("--Please choose an option--");
    const [value, setValue] = useState();

    useEffect(() => {
        if (props.options) {
            setOptions(props.options)
        }
        if (props.default) {
            setPlaceholder(props.default)
        }
    }, [props]);

    useEffect(() => {
        props.value(value);
    }, [props, value]);

    return (
        <div className="dropdown-container">
            <select className="dropdown" onChange={(e) => { setValue(e.target.value) }} defaultValue={placeholder}>

                <option className="dropdown-item" disabled value={placeholder}>{placeholder}</option>
                {options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}

export default Dropdown;
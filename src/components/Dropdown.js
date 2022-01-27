import React, { useEffect, useState } from 'react';
import Theme from '../utils/Theme';

const getContainerStyle = () => ({
    maxWidth: "280px",
    width: "280px"
})

const getSelectStyle = () => ({
    width: "100%",
    height: "40px",
    borderRadius: `${Theme.borderRadius}px`,
    padding: "0 10px 0 10px",
    borderColor: "#CBD6E6",
    color: `${Theme.color.primary}`
})

const Dropdown = (props) => {
    const [options, setOptions] = useState([]);
    const [placeholder, setPlaceholder] = useState("--Choose an option--");
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
        <div style={getContainerStyle()}>
            <select style={getSelectStyle()} onChange={(e) => { setValue(e.target.value) }} defaultValue={placeholder}>
                <option
                    disabled
                    value={props.defaultValue ? props.defaultValue : placeholder}
                >{placeholder}</option>

                {options.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}

export default Dropdown;
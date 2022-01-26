import React, { useEffect, useState } from 'react';
import Theme from '../utils/Theme';

const getContainerStyle = () => ({
    width: "280px"
})

const getInputStyle = () => ({
    height: "40px",
    borderRadius: `${Theme.borderRadius}px`,
    borderStyle: "1",
    padding: "0 10px 0 10px",
    borderColor: "#CBD6E6",
    borderStyle: "solid",
    borderWidth: "1px",
    color: `${Theme.color.primary}`,
})

function Number(props) {
    const [value, setValue] = useState();

    useEffect(() => {
        props.value(value);
    }, [props, value]);

    return (
        <div style={getContainerStyle()}>
            <input style={getInputStyle()} type="number" id="tentacles" name="tentacles"
                min="0" max="20" disabled={props.disabled}
                onChange={(e) => { setValue(e.target.value) }}></input>
        </div>
    );
}

export default Number;
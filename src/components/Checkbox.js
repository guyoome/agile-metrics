import React, { useEffect, useState } from 'react';

import './Checkbox.css';

function Checkbox(props) {
    const [value, setValue] = useState();

    useEffect(() => {
        props.value(value);
    }, [props, value]);

    return (
        // <div className="number-container">
        // <div>
            <input type="checkbox" id="scales" name="scales"
                onClick={(e) => {setValue(e.target.checked) }}></input>
        // </div>
    );
}

export default Checkbox;
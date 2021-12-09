import React, { useEffect, useState } from 'react';

import './Number.css';

/**
 * Form Number 
 * 
 * @typedef Props
 * @property {string} value
 * @property {boolean} disabled
 *
 * @param {Props} props
 * @returns {React.ReactNode}
 */
function Number(props) {
    const [value, setValue] = useState();

    useEffect(() => {
        props.value(value);
    }, [props, value]);
    
    return (
        <div className="number-container">
            <input className="number" type="number" id="tentacles" name="tentacles"
                min="0" max="20" disabled={props.disabled}
                onChange={(e) => { setValue(e.target.value) }}></input>
        </div>
    );
}

export default Number;
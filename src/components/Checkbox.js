import React, { useEffect, useState } from 'react';

function Checkbox(props) {
    const [value, setValue] = useState();

    useEffect(() => {
        props.value(value);
    }, [props, value]);

    return (
        <input type="checkbox" id="scales" name="scales"
            onClick={(e) => { setValue(e.target.checked) }}></input>
    );
}

export default Checkbox;
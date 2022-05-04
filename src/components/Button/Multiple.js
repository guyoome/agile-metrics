import React, { useEffect, useState } from 'react';
import './Button.css';

function Multiple(props) {
    const [selected, setSelected] = useState()

    useEffect(() => {
        if (props.default) {
            const firstInput = props.inputs[0].value;
            setSelected(firstInput);
        }

    }, [])

    useEffect(() => {
        props.selected(selected)
    }, [selected])

    return (
        <>
            {props.inputs.map((element, key) => (
                <button key={key}
                    className={`ternary mr-2 ${(selected === element.value) && "active"}`}
                    onClick={() => setSelected(element.value)}
                > {element.text} </button>
            ))}
        </>
    );
}

export default Multiple;
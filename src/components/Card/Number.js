import React, { useEffect, useState } from 'react';
import "./Card.css";

const getContainerStyle = () => ({
    width: "250px",
    minWidth: "250px",
    height: "250px",
    minHeight: "250px",
    backgroundColor: "rgba(0, 0, 0, .04)",
    borderRadius: "4px",
    display: "flex",
    alignContent: "center",
    flexDirection: "column",
    textAlign: "center",
    padding: "0 8px 0 8px"
})

const getTitleStyle = () => ({
    height: "82px",
    lineHeight: "82px",
    fontSize: "24px"
})

const getValueStyle = () => ({
    fontSize: "70px",
})

function Number(props) {

    return (
        <div style={getContainerStyle()} className="card-tooltip">
            <span style={getTitleStyle()}>{props.title}</span>
            <div>
                <span style={getValueStyle()}>{props.value}</span><span>{props.unit}</span>
            </div>
            <span className='card-tooltip-text'>{props.tooltip ? `💡 ${props.tooltip}` : ""}</span>
        </div>
    );
}

export default Number;
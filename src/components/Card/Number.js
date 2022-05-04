import React, { useEffect, useState } from 'react';

const getContainerStyle = () => ({
    width: "250px",
    height: "250px",
    backgroundColor: "rgba(0, 0, 0, .04)",
    borderRadius: "4px",
    // lineHeight: "250px",
    display: "flex",
    alignContent: "center",
    flexDirection: "column",
    // rowGap: "20px",
    textAlign: "center"
})

const getTitleStyle = () => ({
    height: "82px",
    lineHeight: "82px",
    fontSize: "24px"
})

const getValueStyle = () => ({
    fontSize: "70px",
    // margin:"0 0 0 16px"
})

function Number(props) {

    return (
        <div style={getContainerStyle()}>
            <span style={getTitleStyle()}>{props.title}</span>
            <div>
                <span style={getValueStyle()}>{props.value}</span><span>{props.unit}</span>
            </div>
        </div>
    );
}

export default Number;
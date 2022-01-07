import React, { useEffect, useState } from 'react';
import domtoimage from 'dom-to-image';
import './Button.css';

function SaveAsPNG(props) {

    return (
        <button onClick={() => {
            domtoimage.toPng(document.getElementById(props.node))
                .then(function (dataUrl) {
                    var link = document.createElement('a');
                    link.download = `${props.fileName}.png`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });
        }}><span className='emoji'>{props.icon}</span> {props.text}</button>
    );
}

export default SaveAsPNG;
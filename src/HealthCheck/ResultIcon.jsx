import React, { useEffect, useState } from 'react';

import './result-icon.css';


function ResultIcon({ color, trend }) {
    return (
        <div className="result-icon">
            <div className={`circle --${color}`}></div>
            <div className={`trend --${trend}`}></div>
            <div className={`--${trend}`}>
                <div className="triangle">
                    <div className="triangle-before"></div>
                    <div className="triangle-after"></div>
                </div>
            </div>
        </div>);
}

export default ResultIcon;
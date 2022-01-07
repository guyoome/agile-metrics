import React, { useEffect, useState } from 'react';
import './Navbar.css';

function SaveAsPNG(props) {

    return (
        <nav>
            <div className='navbar-container'>
                <div className='logo'>🎈 Agile Metrics.</div>
                <ul>
                    <li> <a>📈 Burnup</a> </li>
                    <li> <a>🩺 Agile Health Check</a> </li>
                </ul>
            </div>
        </nav>
    );
}

export default SaveAsPNG;
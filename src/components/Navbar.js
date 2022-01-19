import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Navbar.css';

function Navbar(props) {
    const navigate = useNavigate();
    return (
        <nav>
            <div className='navbar-container'>
                <div className='logo' onClick={()=> navigate("/")}>🎈 Agile Metrics.</div>
                <ul>
                    <li> <a onClick={()=> navigate("/burnup")}>📈 Burnup</a> </li>
                    <li> <a onClick={()=> navigate("/health-check")}>🩺 Agile Health Check</a> </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
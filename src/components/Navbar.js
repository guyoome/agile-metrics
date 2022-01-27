import React from 'react';
import { useNavigate } from "react-router-dom";
import './Navbar.css';

const getNavStyle = () => ({
    position: "fixed",
    width: "100%",
    top: "0",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: "#fff",
    zIndex: 999
})

const getContainerStyle = () => ({
    padding: "0 24px",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
})

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav style={getNavStyle()}>
            <div style={getContainerStyle()}>
                <div className='logo' onClick={() => navigate("/")}>🎈 Agile Metrics.</div>
                <ul>
                    <li> <a onClick={() => navigate("/burnup")}>📈 Burnup</a> </li>
                    <li> <a onClick={() => navigate("/health-check")}>🩺 Agile Health Check</a> </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
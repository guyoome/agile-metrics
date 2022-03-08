import React, { useEffect, useState } from 'react';
import * as Button from "../components/Button";
import "./HealthCheck.css";

import glossary from "./glossary.json";


function ReportHealthCheck(props) {
    console.log("props.teams", props.teams)
    return (
        <div className='container'>
            {props.teams.map((e, id) => (
                <div>{e.name}</div>
            ))}
        </div>
    );
}


export default ReportHealthCheck;
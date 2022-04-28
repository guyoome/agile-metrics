import React, { useEffect, useState } from 'react';
import Teams from '../utils/Teams';
import * as Button from "../components/Button";
import { ResponsiveContainer, ComposedChart, Bar, LabelList, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import * as Input from "../components/Input";
import "../HealthCheck/HealthCheck.css";


function Kanban() {

    return (
        <div style={{ textAlign: "start" }}>
            <h1>🧜‍♂️ Kanban</h1>
        </div>
    );
}


export default Kanban;
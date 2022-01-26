import React, { useEffect, useState } from 'react';
import * as Button from "../components/Button";
import "./HealthCheck.css";

import glossary from "./glossary.json";

const getCategories = (json) => {
    const categories = [];
    const keyFound = [];
    for (const [key, value] of Object.entries(json)) {
        let label = key.match(/\[(.*?)\]/)[1];
        if (!keyFound.includes(label)) {
            keyFound.push(label);
        }

    }
    keyFound.forEach(element => {
        categories.push(glossary[element])
    });
    return categories;
}

const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

const getHigher = (obj, param) => {
    const ranking = (param === "trend" ? ["down", "stable", "up"] : ["red", "orange", "green"]);
    let avg = 0;
    let tot = 0;
    for (const key in obj) {
        if (obj.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            const coef = (key === ranking[2] ? 3 : key === ranking[1] ? 2 : 1)
            avg += element * coef;
            tot += element;
        }
    }
    // avg should be 1/2/3
    avg = Math.round(avg / tot);
    return ranking[avg - 1];
}

const getDataTable = (categories, json) => {
    const dataTable = [];
    categories.forEach(category => {
        dataTable.push({
            category,
            tag: getKeyByValue(glossary, category),
            red: 0,
            orange: 0,
            green: 0,
            up: 0,
            stable: 0,
            down: 0,
            result: ""
        })
    });

    // parcourir json et ++ in appropriate field

    for (const [key, value] of Object.entries(json)) {
        let tag = key.match(/\[(.*?)\]/)[1];

        const sanitizeKey = key.slice(0, key.search(/[[]/)).trim();

        const id = dataTable.findIndex((e) => e.tag === tag);

        dataTable.at(id)[glossary[sanitizeKey]] += value.length;
    }

    // Calc of the result
    dataTable.forEach(element => {
        const result = [];

        const color = getHigher({
            red: element.red,
            orange: element.orange,
            green: element.green
        });
        result.push(color === "green" ? "🟢" : color === "orange" ? "🟠" : "🔴");
        const trend = getHigher({
            down: element.down,
            stable: element.stable,
            up: element.up
        }, "trend");
        result.push(trend === "up" ? "🔼" : trend === "stable" ? "⏸" : "🔽");
        element.result = result[0] + result[1];
    });

    return dataTable;
}

function HealthCheck() {

    const [json, setJson] = useState();
    const [categories, setCategories] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [errorJson, setErrorJson] = useState();
    const [team, setTeam] = useState("<team name>");

    useEffect(() => {
        try {
            setCategories(getCategories(json));
            setErrorJson();
        } catch (error) {
            setErrorJson(error.message)
            console.log("💫", error.message)
        }

    }, [json])

    useEffect(() => {
        try {
            setDataTable(getDataTable(categories, json));
            // setDataTable(getResults(categories, json));
            setErrorJson();
        } catch (error) {
            setDataTable([]);
            setErrorJson(error.message);
            console.log("💫", error.message);
        }

    }, [categories, json])

    return (
        <div className='container'>
            <div className='left'>
                {/* <h1 style={{color:"#27416b"}}>Agile Health Check</h1> */}
                <p>🔗<a href='https://metroretro.io/board/LBPH2U7G29TC' target="_blank" rel="noreferrer">Link to MetroRetro template</a></p>
                <input type="text" placeholder='Team Name'
                    onChange={(e) => { setTeam(e.target.value) }}></input>
                <div className='mt-5'></div>
                <textarea rows="5" cols="33"
                    placeholder='Export MetroRetro to JSON'
                    onChange={(e) => {
                        try { setJson(JSON.parse(e.target.value)); setErrorJson() }
                        catch (error) { setErrorJson(error.message); setDataTable([]); }
                    }}>
                </textarea>
                <p style={{ color: "red" }}>{errorJson ? "Invalid JSON" : ""}</p>
            </div>
            <div className='right'>
                <Button.SaveAsPNG icon="💾" text="Download Table" node="agile-health-check-table" fileName="agile-health-check-table" />

                <div className='mt-5'></div>
                <div className='data-table' id='agile-health-check-table'>
                    <table >
                        <thead>
                            <tr>
                                <th>{team}</th>
                                <th>Red <span className='emoji'>🔴</span></th>
                                <th>Orange <span className='emoji'>🟠</span></th>
                                <th>Green <span className='emoji'>🟢</span></th>
                                <th>Trend (<span className='emoji'>🔽</span>/<span className='emoji'>⏸</span>/<span className='emoji'>🔼</span>)</th>
                                <th>Result</th>
                            </tr>
                        </thead>

                        <tbody className='am-data-table__content'>
                            {dataTable.map((element, i) => (
                                <tr key={i}>
                                    <td>{element.category}</td>
                                    <td>{element.red}</td>
                                    <td>{element.orange}</td>
                                    <td>{element.green}</td>
                                    <td>{element.down}/{element.stable}/{element.up}</td>
                                    <td>{element.result}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export default HealthCheck;
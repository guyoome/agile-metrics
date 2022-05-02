import React, { useEffect, useState } from 'react';
import Teams from '../utils/Teams';
import * as Button from "../components/Button";
import { ResponsiveContainer, ComposedChart, Bar, LabelList, Area, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import * as Input from "../components/Input";
import "../HealthCheck/HealthCheck.css";

const editTimeline = (startDate) => {
    const start = parseInt(startDate)
    let obj = {}
    // let i = 0;
    for (var arr = [], dt = new Date(start); dt <= Date.now(); dt.setDate(dt.getDate() + 1)) {
        // const date = new Date(dt);
        // console.log(dt)
        obj[generateDateFormat(dt)] = { column: [0, 0, 0, 0, 0, 0] };
        // obj[generateDateFormat(dt)] = { id: i, column: [0, 0, 0, 0, 0, 0] };
        // i++;
    }
    obj[generateDateFormat(Date.now())] = { column: [0, 0, 0, 0, 0, 0] };
    // console.log("😴obj", obj)
    return obj;
}

const generateDateFormat = (timestamp) => {
    const date = new Date(timestamp);
    return (`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`)
}

const editData = (history, timeline, timeframe) => {
    const arr = []

    // console.log("🦓#1", arr)
    //
    for (const key in history) {
        if (Object.hasOwnProperty.call(history, key)) {
            const change = history[key][0];
            timeline[generateDateFormat(parseInt(key))].column[change.columnTo]++
            if (change.columnFrom !== undefined) {
                timeline[generateDateFormat(parseInt(key))].column[change.columnFrom]--;
            }
        }
    }
    // console.log("🐪#2", timeline)

    // -> Array

    for (const key in timeline) {
        if (Object.hasOwnProperty.call(timeline, key)) {
            const element = timeline[key];
            arr.push({ ...element, date: key })
        }
    }
    // console.log("🐏#3", arr)

    // populate column
    arr.forEach((element, index) => {
        const column = element.column;
        delete element.column;
        arr[index] = { ...element, ...column }
    });
    // console.log("🦥#4", arr)

    // Do the Sum for the scope: [0,1,2,0,1] => [0,1,3,3,4]
    arr.forEach((element, i) => {
        arr[i][0] = (arr[i - 1] ? arr[i - 1][0] + element[0] : element[0]);
        arr[i][1] = (arr[i - 1] ? arr[i - 1][1] + element[1] : element[1]);
        arr[i][2] = (arr[i - 1] ? arr[i - 1][2] + element[2] : element[2]);
        arr[i][3] = (arr[i - 1] ? arr[i - 1][3] + element[3] : element[3]);
        arr[i][4] = (arr[i - 1] ? arr[i - 1][4] + element[4] : element[4]);
        arr[i][5] = (arr[i - 1] ? arr[i - 1][5] + element[5] : element[5]);
    });

    const arrCopy = arr.slice(-timeframe);

    return arrCopy;

}

const editWip = (data, timeframe) => {
    // arr {date,wip}
    const arr = [];

    const dataCopy = data.slice(-timeframe);

    dataCopy.forEach(element => {
        arr.push({
            date: element.date,
            wip: element[3] + element[4]
        })
    });

    // avg WIP
    let tot = 0;
    let sum = 0;
    arr.forEach(element => {
        sum += element.wip
        tot++;
    });
    const avg = sum / tot;
    arr.forEach((element, id) => {
        arr[id].avg = avg;
    });

    return arr;
}

function Kanban() {
    const [history, setHistory] = useState({});
    const [timeline, setTimeline] = useState([]);
    const [data, setData] = useState([]);
    const [wip, setWip] = useState([]);
    const [timeframe, setTimeframe] = useState(0) // x days ago

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${process.env.REACT_APP_ATLASSIAN_AUTH}`);
        myHeaders.append("Cookie", `atlassian.xsrf.token=${process.env.REACT_APP_TOKEN}`);
        myHeaders.append("Accept", "application/json")

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${process.env.REACT_APP_PROXY}/spolio.atlassian.net/rest/greenhopper/1.0/rapid/charts/cumulativeflowdiagram.json?rapidViewId=74&swimlaneId=130&swimlaneId=129&columnId=688&columnId=1037&columnId=689&columnId=690&columnId=695&columnId=691&_=1651150695543`, requestOptions)
            .then(res => res.json())
            .then(result => {
                setHistory(result.columnChanges);
                // console.log("🐍Joe", history)
            })
            .catch(error => console.log('error', error));
    }, [])

    useEffect(() => {

        setTimeline(editTimeline(Object.keys(history)[0]));

    }, [history])

    useEffect(() => {
        setData(editData(history, timeline, timeframe));

    }, [timeline, timeframe])

    useEffect(() => {
        setWip(editWip(data, timeframe));

    }, [data, timeframe])


    return (
        <div style={{ textAlign: "start" }}>
            <h1>🧜‍♂️ Kanban</h1>
            <div className="mt-5">
                <h3>Timeframe</h3>
                <p>Past 2 weeks
                    <Input.Checkbox
                        value={(e) => { e ? setTimeframe(14) : setTimeframe(0) }} />
                </p>
                {/* <p>Past month
                    <Input.Checkbox
                        value={(e) => { e ? setTimeframe(31) : setTimeframe(0) }} />
                </p> */}
            </div>

            <div className="mt-5">
                <ResponsiveContainer height={400}>
                    <ComposedChart data={data}>
                        <CartesianGrid stroke="#ccc" />
                        <Tooltip />
                        <Legend verticalAlign="top" layout="vertical" align="right" wrapperStyle={{ paddingLeft: "10px" }} />

                        <Area type="monotone" dataKey="5" stroke="#FF5630" fillOpacity={1} fill="#FF5630" stackId="1" />
                        {/* <Line type="linear" dataKey="0" stroke="#ffba49" dot={false} strokeWidth={4} /> */}
                        <Area type="monotone" dataKey="4" stroke="#00B8D9" fillOpacity={1} fill="#00B8D9" stackId="1" />
                        {/* <Line type="linear" dataKey="1" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" /> */}
                        <Area type="monotone" dataKey="3" stroke="#36B37E" fillOpacity={1} fill="#36B37E" stackId="1" />
                        <Area type="monotone" dataKey="2" stroke="#6554C0" fillOpacity={1} fill="#6554C0" stackId="1" />
                        {/* <Line type="linear" dataKey="2" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" /> */}
                        {/* <Line type="linear" dataKey="3" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" /> */}
                        <Area type="monotone" dataKey="1" stroke="#008DA6" fillOpacity={1} fill="#008DA6" stackId="1" />
                        <Area type="monotone" dataKey="0" stroke="#FFAB00" fillOpacity={1} fill="#FFAB00" stackId="1" />
                        {/* <Line type="linear" dataKey="4" stroke="#00c39e" dot={false} strokeWidth={3} /> */}
                        {/* <Line type="linear" dataKey="5" stroke="#00c39e" dot={false} strokeWidth={3} /> */}
                        <XAxis dataKey="date" />
                        <YAxis />
                    </ComposedChart >
                </ResponsiveContainer>
            </div>
            <div className="mt-5">
                <ResponsiveContainer height={400}>
                    <ComposedChart data={wip}>
                        <CartesianGrid stroke="#ccc" />
                        <Tooltip />
                        <Legend verticalAlign="top" layout="vertical" align="right" wrapperStyle={{ paddingLeft: "10px" }} />

                        <Line type="linear" dataKey="wip" stroke="#00c39e" dot={false} strokeWidth={3} />
                        <Line type="linear" dataKey="avg" stroke="#FF0000" dot={false} strokeWidth={3} />
                        <XAxis dataKey="date" />
                        <YAxis />
                    </ComposedChart >
                </ResponsiveContainer>
            </div>
        </div>
    );
}


export default Kanban;
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, ComposedChart, Area, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import * as Button from "../components/Button";
import * as Card from "../components/Card";
import * as Input from "../components/Input";
import Teams from '../utils/Teams';
import "../HealthCheck/HealthCheck.css";

const timeframeInput = [
    { text: "All Time", value: 0 },
    { text: "Past 2 weeks", value: 14 },
    { text: "Past month", value: 31 },
    { text: "Past 3 months", value: 92 },
    { text: "Past 6 months", value: 183 }
]

const editTimeline = (startDate) => {
    const start = parseInt(startDate)
    let obj = {}

    for (var arr = [], dt = new Date(start); dt <= Date.now(); dt.setDate(dt.getDate() + 1)) {

        obj[generateDateFormat(dt)] = { column: [0, 0, 0, 0, 0, 0] };
    }
    obj[generateDateFormat(Date.now())] = { column: [0, 0, 0, 0, 0, 0] };

    return obj;
}

const generateDateFormat = (timestamp) => {
    const date = new Date(timestamp);
    return (`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`)
}

const editData = (history, timeline) => {
    const arr = []

    for (const key in history) {
        if (Object.hasOwnProperty.call(history, key)) {
            const change = history[key][0];
            timeline[generateDateFormat(parseInt(key))].column[change.columnTo]++
            if (change.columnFrom !== undefined) {
                timeline[generateDateFormat(parseInt(key))].column[change.columnFrom]--;
            }
        }
    }

    // -> Array
    for (const key in timeline) {
        if (Object.hasOwnProperty.call(timeline, key)) {
            const element = timeline[key];
            arr.push({ ...element, date: key })
        }
    }

    // populate column
    arr.forEach((element, index) => {
        const column = element.column;
        delete element.column;
        arr[index] = { ...element, ...column }
    });

    // Do the Sum for the scope: [0,1,2,0,1] => [0,1,3,3,4]
    arr.forEach((element, i) => {
        arr[i][0] = (arr[i - 1] ? arr[i - 1][0] + element[0] : element[0]);
        arr[i][1] = (arr[i - 1] ? arr[i - 1][1] + element[1] : element[1]);
        arr[i][2] = (arr[i - 1] ? arr[i - 1][2] + element[2] : element[2]);
        arr[i][3] = (arr[i - 1] ? arr[i - 1][3] + element[3] : element[3]);
        arr[i][4] = (arr[i - 1] ? arr[i - 1][4] + element[4] : element[4]);
        arr[i][5] = (arr[i - 1] ? arr[i - 1][5] + element[5] : element[5]);
    });

    return arr;

}

const editWip = (data) => {
    const arr = [];

    data.forEach(element => {
        arr.push({
            date: element.date,
            wip: element[3] + element[4]
        })
    });

    return arr;
}

const editThroughput = (data) => {
    const arr = [];
    // create arr with obj { start:done, end:done } by week (7days)
    let mem = 0;
    data.forEach((element, id) => {
        if (id % 7 === 0) {

            arr.push({ throughput: element[5] - mem, date: element.date });
            mem = element[5];
        }
    });

    return arr;

}

const avg = (arr, key) => {
    const arrCopy = arr.slice();

    // calc avg throughput
    let tot = 0;
    let sum = 0;
    arrCopy.forEach(element => {
        sum += element[key]
        tot++;
    });

    // write avg in arr
    const avg = Math.round((sum / tot) * 100) / 100;
    arrCopy.forEach((element, id) => {
        arr[id].avg = avg;
    });

    return arrCopy;
}

function Kanban() {
    const [teamTag, setTeamTag] = useState("");
    const [team, setTeam] = useState(undefined);
    const [history, setHistory] = useState({});
    const [timeline, setTimeline] = useState([]);
    const [data, setData] = useState([]);
    const [cumulativeFlow, setCumulativeFlow] = useState([]);
    const [wip, setWip] = useState([]);
    const [avgWip, setAvgWip] = useState(0);
    const [throughput, setThroughput] = useState(0);
    const [avgThroughput, setAvgThroughput] = useState(0);
    const [avgCycleTime, setAvgCycleTime] = useState(0);
    const [timeframe, setTimeframe] = useState(0); // x days ago

    useEffect(() => {
        if (team) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Basic ${process.env.REACT_APP_ATLASSIAN_AUTH}`);
            myHeaders.append("Cookie", `atlassian.xsrf.token=${process.env.REACT_APP_TOKEN}`);
            myHeaders.append("Accept", "application/json")

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`${process.env.REACT_APP_PROXY}/spolio.atlassian.net/rest/greenhopper/1.0/rapid/charts/cumulativeflowdiagram.json?rapidViewId=${team.id}&swimlaneId=${team.swimlaneId}${team.columns.map(column => (`&columnId=${column.id}`)).join('')}`, requestOptions)
                .then(res => res.json())
                .then(result => {
                    setHistory(result.columnChanges);
                })
                .catch(error => console.log('error', error));
        }
    }, [team])

    useEffect(() => {
        setTeam(Teams.getTeamByTag(teamTag));

    }, [teamTag])

    useEffect(() => {

        setTimeline(editTimeline(Object.keys(history)[0]));

    }, [history])

    useEffect(() => {
        setData(editData(history, timeline));

    }, [timeline])

    useEffect(() => {
        setCumulativeFlow(data.slice(-timeframe));

    }, [data, timeframe])

    useEffect(() => {
        // Timeframe is handle by cumulativeFlow
        // wip don't need previous values to calculate the actual one in the timeframe
        const globalWip = editWip(cumulativeFlow);
        setWip(avg(globalWip, "wip"));

    }, [cumulativeFlow])

    useEffect(() => {
        if (wip[0] !== undefined) {
            setAvgWip(wip[0].avg);
        }

    }, [wip])

    useEffect(() => {
        const globalThroughput = editThroughput(data).slice(-timeframe / 7); // /7 because it's week not days
        setThroughput(avg(globalThroughput, "throughput"));

    }, [data, timeframe])

    useEffect(() => {
        if (throughput[0] !== undefined) {
            setAvgThroughput(throughput[0].avg);
        }

    }, [throughput])

    useEffect(() => {
        if (avgWip && avgThroughput) {
            const littleLaw = avgWip / (avgThroughput / 7);
            setAvgCycleTime(Math.round(littleLaw * 100) / 100);
        }

    }, [avgWip, avgThroughput])


    return (
        <div style={{ textAlign: "start" }}>

            <h1>🧜‍♂️ Kanban</h1>
            <div className='layout mt-5'>
                <Input.Dropdown default="--Choose a team--"
                    options={Teams.getTagsByType("kanban")}
                    value={(e) => { setTeamTag(e) }} />

                <Button.SaveAsPNG icon="💾" text="Download Dashboard" node="kanban-dashboard" fileName="kanban-dashboard" />
            </div>
            <div id='kanban-dashboard' style={{ padding: "0 0 20px 0" }}>

                <div className="mt-5">

                    <h3>Timeframe</h3>
                    <Button.Multiple default inputs={timeframeInput}
                        selected={(e) => setTimeframe(e)} />
                </div>

                <div className="mt-5 layout">
                    <Card.Number className="layout-item" title="Cycle Time" value={avgCycleTime} unit="days" tooltip="Average time an item take from inProgress to Done" />
                    <Card.Number className="layout-item" title="Wip" value={avgWip} unit="items" tooltip="Average number of items in progress" />
                    <Card.Number className="layout-item" title="Throughput" value={avgThroughput} unit="items" tooltip="Average number of items done per weeks" />

                    <div style={{ width: "100%", height: "250px", backgroundColor: "rgba(0, 0, 0, .04)", padding: "16px 16px 0 0", borderRadius: "4px" }}>
                        <ResponsiveContainer className="layout-item" >
                            <ComposedChart data={cumulativeFlow}>
                                <CartesianGrid stroke="#ccc" />
                                <Tooltip />
                                <Legend verticalAlign="top" layout="vertical" align="center" wrapperStyle={{ paddingLeft: "10px" }} />

                                <Area type="monotone" dataKey="5" stroke="#FF5630" fillOpacity={1} fill="#FF5630" stackId="1" isAnimationActive={false} />
                                <Area type="monotone" dataKey="4" stroke="#00B8D9" fillOpacity={1} fill="#00B8D9" stackId="1" isAnimationActive={false} />
                                <Area type="monotone" dataKey="3" stroke="#36B37E" fillOpacity={1} fill="#36B37E" stackId="1" isAnimationActive={false} />
                                <Area type="monotone" dataKey="2" stroke="#6554C0" fillOpacity={1} fill="#6554C0" stackId="1" isAnimationActive={false} />
                                <Area type="monotone" dataKey="1" stroke="#008DA6" fillOpacity={1} fill="#008DA6" stackId="1" isAnimationActive={false} />
                                <Area type="monotone" dataKey="0" stroke="#FFAB00" fillOpacity={1} fill="#FFAB00" stackId="1" isAnimationActive={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                            </ComposedChart >
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="mt-5 layout">

                    <div style={{ width: "100%", height: "300px", backgroundColor: "rgba(0, 0, 0, .04)", padding: "16px 16px 0 0", borderRadius: "4px" }}>
                        <ResponsiveContainer >
                            <ComposedChart data={wip}>
                                <CartesianGrid stroke="#ccc" />
                                <Tooltip />
                                <Legend verticalAlign="top" layout="vertical" align="right" wrapperStyle={{ paddingLeft: "10px" }} />

                                <Line type="linear" dataKey="wip" stroke="#00c39e" dot={false} strokeWidth={3} isAnimationActive={false} />
                                <Line type="linear" dataKey="avg" stroke="#FF0000" dot={false} strokeWidth={3} />
                                <XAxis dataKey="date" />
                                <YAxis />
                            </ComposedChart >
                        </ResponsiveContainer>
                    </div>

                    <div style={{ width: "100%", height: "300px", backgroundColor: "rgba(0, 0, 0, .04)", padding: "16px 16px 0 0", borderRadius: "4px" }}>
                        <ResponsiveContainer>
                            <ComposedChart data={throughput}>
                                <CartesianGrid stroke="#ccc" />
                                <Tooltip />
                                <Legend verticalAlign="top" layout="vertical" align="right" wrapperStyle={{ paddingLeft: "10px" }} />

                                <Line type="linear" dataKey="throughput" stroke="#00c39e" dot={false} strokeWidth={3} isAnimationActive={false} />
                                <Line type="linear" dataKey="avg" stroke="#FF0000" dot={false} strokeWidth={3} />
                                <XAxis dataKey="date" />
                                <YAxis />
                            </ComposedChart >
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Kanban;
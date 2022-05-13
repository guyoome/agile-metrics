import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, ComposedChart, Area, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import * as Button from "../../components/Button";
import * as Card from "../../components/Card";
import * as Input from "../../components/Input";
import * as kanban from "./Kanban.logic";
import Teams from '../../utils/Teams';
import "../HealthCheck/HealthCheck.css";

const timeframeInput = [
    { text: "All Time", value: 0 },
    { text: "Past 2 weeks", value: 14 },
    { text: "Past month", value: 31 },
    { text: "Past 3 months", value: 92 },
    { text: "Past 6 months", value: 183 }
];

const colors = [
    "#FF5630",
    "#00B8D9",
    "#36B37E",
    "#6554C0",
    "#008DA6",
    "#FFAB00"
]

function Kanban() {
    const [teamTag, setTeamTag] = useState("");
    const [team, setTeam] = useState(undefined);
    const [history, setHistory] = useState({});
    const [timeline, setTimeline] = useState([]);
    const [data, setData] = useState([]);
    const [cumulativeFlow, setCumulativeFlow] = useState([]);
    const [wip, setWip] = useState([]);
    const [wipAvg, setWipAvg] = useState(0);
    const [wipTrend, setWipTrend] = useState("");
    const [throughput, setThroughput] = useState(0);
    const [throughputAvg, setThroughputAvg] = useState(0);
    const [throughputTrend, setThroughputTrend] = useState("");
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
        if (team !== undefined) {
            setTimeline(kanban.editTimeline(Object.keys(history)[0], team.columns));

        }

    }, [history])

    useEffect(() => {
        if (team !== undefined) {
            setData(kanban.editData(history, timeline, team.columns));
        }

    }, [timeline])

    useEffect(() => {
        setCumulativeFlow(data.slice(-timeframe));

    }, [data, timeframe])

    useEffect(() => {
        // Timeframe is handle by cumulativeFlow
        // wip don't need previous values to calculate the actual one in the timeframe
        if (team !== undefined) {
            const globalWip = kanban.editWip(cumulativeFlow, team.columns);
            setWip(kanban.avg(globalWip, "wip"));
        }

    }, [cumulativeFlow])

    useEffect(() => {
        if (wip[0] !== undefined) {
            setWipAvg(wip[0].avg);

        }

    }, [wip])

    useEffect(() => {
        if (wip[0] !== undefined) {
            setWipTrend(kanban.getTrend(wip, "wip"));
        }
    }, [wip])

    useEffect(() => {
        if (team !== undefined && team) {
            const globalThroughput = kanban.editThroughput(data, team.columns).slice(-timeframe / 7); // /7 because it's week not days
            setThroughput(kanban.avg(globalThroughput, "throughput"));

        }
    }, [data, timeframe])

    useEffect(() => {
        if (throughput[0] !== undefined) {
            setThroughputAvg(throughput[0].avg);
        }

    }, [throughput])

    useEffect(() => {
        if (throughput[0] !== undefined) {
            setThroughputTrend(kanban.getTrend(throughput, "throughput"));
        }

    }, [throughput])

    useEffect(() => {
        if (wipAvg && throughputAvg) {
            const littleLaw = wipAvg / (throughputAvg / 7);
            setAvgCycleTime(Math.round(littleLaw * 100) / 100);
        }

    }, [wipAvg, throughputAvg])


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
                    <Card.Number className="layout-item" title={`Wip ${wipTrend}`} value={wipAvg} unit="items" tooltip="Average number of items in progress" />
                    <Card.Number className="layout-item" title={`Throughput ${throughputTrend}`} value={throughputAvg} unit="items" tooltip="Average number of items done per weeks" />

                    <div style={{ width: "100%", height: "250px", backgroundColor: "rgba(0, 0, 0, .04)", padding: "16px 16px 0 0", borderRadius: "4px" }}>
                        <ResponsiveContainer className="layout-item" >
                            <ComposedChart data={cumulativeFlow}>
                                <CartesianGrid stroke="#ccc" />
                                <Tooltip />
                                {team && team.columns.slice(0).reverse().map((column, id) => (
                                    <Area key={id} type="monotone" dataKey={column.name} stroke={colors[id]} fillOpacity={1} fill={colors[id]} stackId="1" isAnimationActive={false} />
                                ))}
                                <Legend verticalAlign="middle" layout="vertical" align="right" wrapperStyle={{ paddingLeft: "8px" }}/>
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
import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import Teams from '../utils/Teams';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import burnup from "./Burnup.logic";

import "./Burnup.css"


/**
 * Component for showing an Epic Burnup chart of a Team.
 *
 * @component
 */
function Burnup() {
    const [team, setTeam] = useState({});
    const [epic, setEpic] = useState([]);
    const [quarterStart, setQuarterStart] = useState();
    const [forecastScope, setForecastScope] = useState(0);

    const [chartData, setChartData] = useState([]);

    const [history, setHistory] = useState({});
    const [sprints, setSprints] = useState([]);
    const [epicList, setEpicList] = useState([])

    /**
     * Fetch Epic List
     * @hook
     */
    useEffect(() => {
        if (team.id !== undefined) {

            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Basic Z21hdXJpbkBzcGxpby5jb206b280cFE5VzBYTDdJbExJblk0U3k5MDc5");
            myHeaders.append("Cookie", "atlassian.xsrf.token=BNWZ-WAR4-YNI8-IQN1_739802b74faefc4635c22ea101562fd664a25d54_lin");
            myHeaders.append("Accept", "application/json")

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://maur-proxy.herokuapp.com/https://spolio.atlassian.net/rest/greenhopper/1.0/xboard/plan/backlog/epics.json?rapidViewId=${team.id}`, requestOptions)
                .then(res => res.json())
                .then(result => {
                    setEpicList(result.epics);
                })
                .catch(error => console.log('error', error));
        }

    }, [team])

    /**
     * Fetch Epic History & Sprints
     * @hook
     */
    useEffect(() => {
        if (team.id !== undefined & epic.id !== undefined) {

            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Basic Z21hdXJpbkBzcGxpby5jb206b280cFE5VzBYTDdJbExJblk0U3k5MDc5");
            myHeaders.append("Cookie", "atlassian.xsrf.token=BNWZ-WAR4-YNI8-IQN1_739802b74faefc4635c22ea101562fd664a25d54_lin");
            myHeaders.append("Accept", "application/json")

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://maur-proxy.herokuapp.com/https://spolio.atlassian.net/rest/greenhopper/1.0/rapid/charts/epicburndownchart?rapidViewId=${team.id}&epicKey=${epic.id}`, requestOptions)
                .then(res => res.json())
                .then(result => {
                    setHistory(result.changes);
                    setSprints(result.sprints);
                })
                .catch(error => console.log('error', error));
        }
    }, [epic, team])

    /**
     * Set Chart Data
     * @hook
     */
    useEffect(() => {
        const chartDataSet = burnup.getChartDataSet(sprints, history, quarterStart, forecastScope);
        setChartData(chartDataSet);

    }, [history, sprints, quarterStart, forecastScope])


    return (
        <div >
            <div className="flex-container">

                <div className="flex-item">
                    <Dropdown default="choose a team"
                        options={Teams.getTags()}
                        value={(e) => { setTeam(Teams.getTeamByTag(e)) }} />
                </div>

                <div className="flex-item">
                    <Dropdown default="choose an epic"
                        options={burnup.getNotDoneEpicsSummary(epicList)}
                        value={(e) => { setEpic(burnup.getEpicBySummary(epicList, e)) }}
                    />
                </div>

            </div>
            <div className="flex-container mt-5">
                <div className="flex-item">
                    <Dropdown default="choose start Quarter"
                        options={["1", "2", "3", "4"]}
                        value={(e) => { setQuarterStart(parseInt(e, 10)) }}
                    />
                </div>

                <div className="flex-item">
                    <Dropdown default="choose forecast"
                        options={["1", "2", "3", "4", "5"]}
                        value={(e) => { setForecastScope(parseInt(e, 10)) }}
                    />
                </div>
            </div>

            <p>The Burnup chart of <span className="highlight">{team.name ? team.name : "..."}</span> team
                for <span className="highlight">{epic.summary ? epic.summary : "..."}</span> epic.</p>

            <p>From <span className="highlight">{quarterStart ? "Q" + quarterStart : "..."}</span>,</p>
            {/* to <span className="highlight">{forecastScope ? "Q" + quarterEnd : "..."}</span> */}

            <div className="mt-5">
                <ResponsiveContainer height={400}>
                    <LineChart data={chartData}>
                        <CartesianGrid stroke="#ccc" />
                        <Line type="linear" dataKey="scope" stroke="#ffba49" dot={false} strokeWidth={4} />
                        <Line type="linear" dataKey="avg" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" />
                        <Line type="linear" dataKey="avgmore" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" />
                        <Line type="linear" dataKey="avgless" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" />
                        <Line type="linear" dataKey="doneIssues" stroke="#00c39e" strokeWidth={3}/>
                        <XAxis dataKey="name" />
                        <YAxis />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Burnup;

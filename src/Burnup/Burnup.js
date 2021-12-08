import React, { useEffect, useState } from 'react';
import * as Input from "../components/Input";
import Teams from '../utils/Teams';
import { ResponsiveContainer, ComposedChart, Bar, LabelList, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import * as burnup from "./Burnup.logic";

import "./Burnup.css"


/**
 * Component for showing an Epic Burnup chart of a Team.
 *
 * @component
 */
function Burnup() {
    const [team, setTeam] = useState({});
    const [epic, setEpic] = useState([]);
    const [sprintStart, setSprintStart] = useState();
    const [forecastScope, setForecastScope] = useState(0);

    const [chartData, setChartData] = useState([]);

    const [history, setHistory] = useState({});
    const [sprints, setSprints] = useState([]);
    const [epicList, setEpicList] = useState([])

    const [isQuarterShown, setIsQuarterShown] = useState(false);

    const [showLegend, setShowLegend] = useState(false);

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

            console.log("🎁Velocity🎁", Teams.getVelocityOf(team.tag))
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
        const chartDataSet = burnup.getChartDataSet(sprints, history, sprintStart, forecastScope, isQuarterShown);

        setChartData(chartDataSet);

    }, [history, sprints, sprintStart, forecastScope, isQuarterShown])


    return (
        <div >
            <div className="flex-container">

                <div className="flex-item">
                    <Input.Dropdown default="choose a team"
                        options={Teams.getTags()}
                        value={(e) => { setTeam(Teams.getTeamByTag(e)) }} />
                </div>

                <div className="flex-item">
                    <Input.Dropdown default="choose an epic"
                        options={burnup.getNotDoneEpicsSummary(epicList)}
                        value={(e) => { setEpic(burnup.getEpicBySummary(epicList, e)) }}
                    />
                </div>

            </div>
            <div className="flex-container mt-5">
                <div className="flex-item">
                    <Input.Dropdown default="choose start Sprint"
                        options={burnup.getSprints(sprints)}
                        value={(e) => { setSprintStart(e) }}
                    />
                </div>

                <div className="flex-item">
                    <Input.Number
                        disabled={sprints.length ? false : true}
                        value={(e) => { setForecastScope(parseInt(e, 10)) }} />
                </div>
            </div>

            <p className="mt-5">The Burnup chart of <span className="highlight">{team.name ? team.name : "..."}</span> team
                for <span className="highlight">{epic.summary ? epic.summary : "..."}</span> epic.</p>

            <p>From <span className="highlight">{sprintStart ? sprintStart : "..."}</span>,
                with a forecast on  <span className="highlight">{forecastScope ? forecastScope + " Sprints" : "..."}</span></p>

            <div className="mt-5">
                <ResponsiveContainer height={400}>
                    <ComposedChart data={chartData}>
                        <CartesianGrid stroke="#ccc" />
                        <Tooltip />
                        {!!showLegend ?
                            <Legend verticalAlign="top" layout="vertical" align="right" wrapperStyle={{ paddingLeft: "10px" }} />
                            : ""
                        }

                        <Bar dataKey="quarter" barSize={40} fill="#FAC9C1" >
                            <LabelList dataKey="quarterlabel" fill="#ed1c24" fontWeight="bold" position="insideTop" />
                        </Bar>
                        <Line type="linear" dataKey="scope" stroke="#ffba49" dot={false} strokeWidth={4} />
                        <Line type="linear" dataKey="avg" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" />
                        <Line type="linear" dataKey="avgmore" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" />
                        <Line type="linear" dataKey="avgless" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" />
                        <Line type="linear" dataKey="doneIssues" stroke="#00c39e" strokeWidth={3} />
                        <XAxis dataKey="name" />
                        <YAxis />
                    </ComposedChart >
                </ResponsiveContainer>
            </div>


            <div className="flex-container mt-5">
                <div className="flex-item">
                    <p>Show Quarters
                        <Input.Checkbox
                            value={(e) => { setIsQuarterShown(e) }} />
                    </p>
                </div>
                <div className="flex-item">
                    <p>Show Burnup Legend
                        <Input.Checkbox
                            value={(e) => { setShowLegend(e) }} />
                    </p>
                </div>
            </div>

        </div>
    );
}

export default Burnup;

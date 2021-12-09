import React, { useEffect, useState } from 'react';
import * as Input from "../components/Input";
import Teams from '../utils/Teams';
import { ResponsiveContainer, ComposedChart, Bar, LabelList, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import * as burnup from "./Burnup.logic";

import "./Burnup.css";

import backlog from "./backlog.json";

const sanitizeBacklog = (backlog) => {
    const sanitizeBacklog = backlog.columnChanges;

    Object.entries(sanitizeBacklog).forEach(([key, value]) => {
        if (value[0].statusTo) {
            switch (value[0].statusTo) {
                case "10000":
                    value[0].added = true;
                    break;
                case "10300":
                case "10001":
                    value[0].column = { done: true };
                    break;
                default:
                    break;
            }
        }
    })

    console.log("🤩", sanitizeBacklog)
    return sanitizeBacklog;
}


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

    const [showBacklogBurnup, setShowBacklogBurnup] = useState(false);

    /**
     * Fetch Epic List
     * It's trigger on update of [team]
     * @hook
     */
    useEffect(() => {
        if (team.id !== undefined) {

            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Basic ${process.env.REACT_APP_ATLASSIAN_AUTH}`);
            myHeaders.append("Cookie", `atlassian.xsrf.token=${process.env.REACT_APP_TOKEN}`);
            myHeaders.append("Accept", "application/json")

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            // Get Epic list
            fetch(`${process.env.REACT_APP_PROXY}/https://spolio.atlassian.net/rest/greenhopper/1.0/xboard/plan/backlog/epics.json?rapidViewId=${team.id}`, requestOptions)
                .then(res => res.json())
                .then(result => {
                    setEpicList(result.epics);
                })
                .catch(error => console.log('error', error));

            
        }

    }, [team])

    /**
     * Fetch Epic History & Sprints
     * It's trigger on update of [epic, team]
     * @hook
     */
    useEffect(() => {
        if (team.id !== undefined & epic.id !== undefined) {

            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Basic ${process.env.REACT_APP_ATLASSIAN_AUTH}`);
            myHeaders.append("Cookie", `atlassian.xsrf.token=${process.env.REACT_APP_TOKEN}`);
            myHeaders.append("Accept", "application/json")

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`${process.env.REACT_APP_PROXY}/https://spolio.atlassian.net/rest/greenhopper/1.0/rapid/charts/epicburndownchart?rapidViewId=${team.id}&epicKey=${epic.id}`, requestOptions)
                .then(res => res.json())
                .then(result => {
                    setHistory(result.changes);
                    setSprints(result.sprints);
                })
                .catch(error => console.log('error', error));

            // Get Backlog infos
            // fetch(`${process.env.REACT_APP_PROXY}/https://spolio.atlassian.net/rest/greenhopper/1.0/xboard/plan/backlog/epics.json?rapidViewId=${team.id}`, requestOptions)
            //     .then(res => res.json())
            //     .then(result => {
            //         setEpicList(result.epics);
            //     })
            //     .catch(error => console.log('error', error));
        }
    }, [epic, team])

    /**
     * Set Chart Data
     * It's trigger on update of [history, sprints, sprintStart, forecastScope, isQuarterShown]
     * @hook
     */
    useEffect(() => {
        let chartDataSet;
        let activity;
        if (showBacklogBurnup) {
            activity = sanitizeBacklog(backlog);
            chartDataSet = burnup.getChartDataSet(sprints, activity);
        } else {
            activity = history
            chartDataSet = burnup.getChartDataSet(sprints, activity);
        }


        // If sprintStart is set, slice the chart data set with sprintStart as begining of data set 
        if (sprintStart) {
            chartDataSet = burnup.getChartDataBegin(chartDataSet, { name: sprintStart });
        }

        // If Forecast is set, get data set with forecast
        if (forecastScope && sprints !== []) {
            chartDataSet = burnup.getChartDataSetWithForecast(sprints, activity, chartDataSet, forecastScope);
        }

        // const chartDataSet = burnup.getChartDataSet(sprints, history, quarterStart, forecastScope, isQuarterShown);
        // const chartDataSet = burnup.getChartDataSet(sprints, history, sprintStart, forecastScope, velocity, isQuarterShown);

        // If Quarter need to be display, get data set with quarter 
        if (isQuarterShown) {
            chartDataSet = burnup.getChartDataSetWithQuarter(chartDataSet);
        }

        // set chart data state, to display the burnup
        setChartData(chartDataSet);

    }, [history, sprints, sprintStart, forecastScope, isQuarterShown, showBacklogBurnup])


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
                {!!showBacklogBurnup ?
                    <span>, <span className="highlight">Backlog</span></span>
                    :
                    <span>for <span className="highlight">{epic.summary ? epic.summary : "..."}</span> epic.</span>
                }
            </p>

            <p>From <span className="highlight">{sprintStart ? sprintStart : "..."}</span>,
                with a forecast on  <span className="highlight">{forecastScope ? forecastScope : "..."}</span> Sprints</p>

            <div className="mt-5">
                <ResponsiveContainer height={400}>
                    <ComposedChart data={chartData}>
                        <CartesianGrid stroke="#ccc" />
                        <Tooltip />
                        {!!showLegend && <Legend verticalAlign="top" layout="vertical" align="right" wrapperStyle={{ paddingLeft: "10px" }} />}

                        <Bar dataKey="quarter" barSize={40} fill="#FAC9C1" >
                            <LabelList dataKey="quarterlabel" fill="#ed1c24" fontWeight="bold" position="insideTop" />
                        </Bar>
                        <Line type="linear" dataKey="scope" stroke="#ffba49" dot={false} strokeWidth={4} />
                        <Line type="linear" dataKey="forecast" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" />
                        <Line type="linear" dataKey="forecastHigh" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" />
                        <Line type="linear" dataKey="forecastLow" stroke="#CBD6E6" dot={false} strokeWidth={2} strokeDasharray="4 4" />
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
                <div className="flex-item">
                    <p>Show Backlog Burnup
                        <Input.Checkbox
                            value={(e) => { setShowBacklogBurnup(e) }} />
                    </p>
                </div>
            </div>

        </div>
    );
}


export default Burnup;
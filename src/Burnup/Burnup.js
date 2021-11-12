import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import Teams from '../utils/Teams';
// import Epic from './core/Epic';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import burnup from "./Burnup.logic";

import "./Burnup.css"


const getForecastScope = (sprints, quarterEnd) => {
    const forecastScope = [];
    // quarter === 1/2/3/4
    // 1 - Janvier/Fevrier/Mars
    // 2 - Avril/Mai/Juin
    // 3 - Juillet/Aout/Septembre
    // 4 - Octobre/Novembre/Decembre
    // new Date(year,monthID,day)

    const today = new Date();
    let firstDayOfQuarter = new Date(today.getFullYear(), 0).getTime()
    switch (quarterEnd + 1) {
        case 5:
            firstDayOfQuarter = new Date(today.getFullYear() + 1, 0).getTime()
            // return 01/10/today.year
            break;
        case 4:
            firstDayOfQuarter = new Date(today.getFullYear(), 9).getTime()
            // return 01/10/today.year
            break;
        case 3:
            firstDayOfQuarter = new Date(today.getFullYear(), 6).getTime()
            // return 01/07/today.year
            break;
        case 2:
            firstDayOfQuarter = new Date(today.getFullYear(), 3).getTime()
            // return 01/04/today.year 
            break;
    }

    // Define the last sprint 
    // let endSprint = {};

    if (sprints.length > 0) {


        let endSprint;

        sprints.forEach((sprint, i) => {
            if (firstDayOfQuarter <= sprint.startTime && firstDayOfQuarter > (typeof sprints[i - 1] !== 'undefined' ? sprints[i - 1].startTime : sprint.startTime)) {
                endSprint = typeof sprints[i - 1] !== 'undefined' ? sprints[i - 1] : sprint;
                // We can add abreak here /!\
            }
        });

        if (typeof endSprint === "undefined") {
            // console.log('(sprints.at(-1)).endTime:',sprints.at(-1).endTime)
            let lastSprintEndTime = (sprints.at(-1)).endTime;
            // console.log
            let i = 0
            while (typeof endSprint === "undefined") {
                forecastScope.push({ name: "Sprint X", startTime: lastSprintEndTime, endTime: lastSprintEndTime + 1209600 })
                if (firstDayOfQuarter <= forecastScope.startTime && firstDayOfQuarter > (typeof forecastScope[i - 1] !== 'undefined' ? forecastScope[i - 1].startTime : forecastScope.startTime)) {
                    endSprint = typeof forecastScope[i - 1] !== 'undefined' ? forecastScope[i - 1] : forecastScope;
                    // We can add abreak here /!\
                } else {
                    lastSprintEndTime = typeof forecastScope.at(-1) ? forecastScope.at(-1).endTime : forecastScope.at(0);
                    i++;
                }
            }

        }
    }

    return forecastScope;
    // return Array[{name:"sprint X"}]
}

// const updateEndSprint = (sprints, quarterEnd) => {
//     // quarter === 1/2/3/4
//     // 1 - Janvier/Fevrier/Mars
//     // 2 - Avril/Mai/Juin
//     // 3 - Juillet/Aout/Septembre
//     // 4 - Octobre/Novembre/Decembre
//     // new Date(year,monthID,day)

//     const today = new Date();
//     let firstDayOfQuarter = new Date(today.getFullYear(), 0).getTime()
//     switch (quarterEnd + 1) {
//         case 5:
//             firstDayOfQuarter = new Date(today.getFullYear() + 1, 0).getTime()
//             // return 01/10/today.year
//             break;
//         case 4:
//             firstDayOfQuarter = new Date(today.getFullYear(), 9).getTime()
//             // return 01/10/today.year
//             break;
//         case 3:
//             firstDayOfQuarter = new Date(today.getFullYear(), 6).getTime()
//             // return 01/07/today.year
//             break;
//         case 2:
//             firstDayOfQuarter = new Date(today.getFullYear(), 3).getTime()
//             // return 01/04/today.year 
//             break;
//     }

//     let endSprint = sprints.at(-1);

//     sprints.forEach((sprint, i) => {
//         if (firstDayOfQuarter <= sprint.startTime && firstDayOfQuarter > (typeof sprints[i - 1] !== 'undefined' ? sprints[i - 1].startTime : sprint.startTime)) {
//             endSprint = typeof sprints[i - 1] !== 'undefined' ? sprints[i - 1] : sprint;
//             // We can add abreak here /!\
//         }
//     });

//     if (endSprint === sprints.at(-1)) {
//         console.log("aaaaa");


//     }

//     return endSprint;
// }

// const getChartDataSetForecast = () => {

// }

const getAverageDoneBySprint = (sprints, history, interval = 10) => {
    const chartDataSet = burnup.getChartDataSet(sprints, history, 0);

    let totalDoneIssues = 0;
    let totalSprints = chartDataSet.length;

    chartDataSet.forEach((element, i) => {
        console.log(element.doneIssues)
        const done = element.doneIssues - (i === 0 ? 0 : chartDataSet[i - 1].doneIssues);
        totalDoneIssues += done;
        if (element.doneIssues === 0) {
            totalSprints--;
        }
    });

    const averageDoneBySprint = totalDoneIssues / totalSprints;

    return averageDoneBySprint;
}

const getForecast = (forecastScope, sprints, history) => {
    let forecast = [];
    if (forecastScope > 0) {
        forecast = new Array(forecastScope);
        forecast.fill({ name: "Sprint " });
    }


    const lastSprint = sprints.slice(-1);
    let lastSprintName
    let lastSprintID;
    if (lastSprint.length > 0) {
        lastSprintName = lastSprint[0].name;
        lastSprintID = parseInt(lastSprintName.replace(/[^0-9]/g, ""), 10);
    }

    const scope = burnup.getScope(sprints, history);

    forecast.forEach((element, i) => {
        forecast[i] = {
            name: element.name + (lastSprintID + 1),
            scope: scope.at(-1).value
        }
        lastSprintID++
    });

    console.log("getAverageDoneBySprint", getAverageDoneBySprint(sprints, history));
    const avg = getAverageDoneBySprint(sprints, history);

    forecast.forEach((element, i) => {
        forecast[i].avg = (i > 0 ? forecast[i - 1] + avg : avg)
    });

    return forecast;
}


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
        console.log("getNotDoneEpicsSummary", burnup.getNotDoneEpicsSummary(epicList))
    }, [epic, team])

    /**
     * Set Chart Data
     * @hook
     */
    useEffect(() => {
        const chartDataSet = burnup.getChartDataSet(sprints, history, quarterStart);
        setChartData(chartDataSet.concat(getForecast(forecastScope, sprints, history)));

        // if (forecastScope && sprints !== []) {
        //     console.log("🎈getForecast🎈", getForecast(forecastScope, sprints, history))
        // }

    }, [history, sprints, quarterStart])


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
                        <Line type="linear" dataKey="doneIssues" stroke="#00c39e" strokeWidth={3} />
                        <Line type="linear" dataKey="avg" stroke="#f00" strokeWidth={2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Burnup;

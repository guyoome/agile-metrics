import React, { useEffect, useState } from 'react';
import Teams from '../../utils/Teams';
import * as Button from "../../components/Button";
import { ResponsiveContainer, ComposedChart, Bar, LabelList, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import * as Input from "../../components/Input";
import "../HealthCheck/HealthCheck.css";



const getLayoutStyle = () => ({

})

const variance = (a, b) => {
    return (Math.abs(a - b) / a) * 100;
}

const average = (a) => {
    return sum(a) / a.length;
}

const sum = (a) => {
    let total = 0;
    a.forEach(element => {
        total += element;
    });
    return total;
}

// Commitment = (ABS(commited-actual)/commited)*100
function Commitment() {
    const [data, setData] = useState({});
    const [commitment, setCommitment] = useState({});
    const [chartData, setChartData] = useState({});
    const [selectedTeam, setSelectedTeam] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${process.env.REACT_APP_ATLASSIAN_AUTH}`);
        myHeaders.append("Cookie", `atlassian.xsrf.token=${process.env.REACT_APP_TOKEN}`);
        myHeaders.append("Accept", "application/json")

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            signal
        };

        for (const team of Teams.list) {
            fetch(`${process.env.REACT_APP_PROXY}/https://spolio.atlassian.net/rest/greenhopper/1.0/rapid/charts/velocity.json?rapidViewId=${team.id}`, requestOptions)
                .then(res => res.json())
                .then(result => {
                    setData(prevData => ({ ...prevData, [team.tag]: Object.values(result.velocityStatEntries) }));
                })
                .catch(error => console.log('error', error));
        }

        return () => {
            // cancel the request before component unmounts
            controller.abort();
        };
    }, [])

    useEffect(() => {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const team = data[key];
                const teamVariance = [];
                team.forEach(sprint => {
                    teamVariance.push(variance(sprint.estimated.value, sprint.completed.value))
                });
                setCommitment(prevCommitment => ({ ...prevCommitment, [key]: teamVariance }));
            }
        }
    }, [data])

    useEffect(() => {
        if (Object.keys(commitment).length > 0 && Teams.getTags().includes(selectedTeam)) {
            const stats = [];
            data[selectedTeam].forEach((sprint, id) => {
                stats.push({
                    name: "Sprint -" + (data[selectedTeam].length - id),
                    estimated: sprint.estimated.value,
                    completed: sprint.completed.value,
                    error: Math.round(commitment[selectedTeam][id] * 100) / 100,
                    avg: Math.round(average(commitment[selectedTeam]) * 100) / 100
                })
            });
            setChartData(stats);
        }
    }, [commitment, selectedTeam])

    return (
        <div style={{ textAlign: "start" }}>
            <h1>???? Commitment</h1>
            <div className='data-table' id='agile-health-check-table'>
                <table >
                    <thead>
                        <tr>
                            {Object.keys(commitment).length !== 0 ?
                                Object.keys(commitment).map((e, id) => (
                                    <th key={id}>{e}</th>
                                ))
                                :
                                <th>-</th>
                            }
                        </tr>
                    </thead>

                    <tbody className='am-data-table__content'>
                        <tr>
                            {Object.keys(commitment).length !== 0 ?
                                Object.values(commitment).map((e, id) => (
                                    <td key={id}>{Math.round(average(e) * 100) / 100}%</td>
                                ))
                                :
                                <th>-</th>
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex-item mt-5">
                <Input.Dropdown default="--Choose a team--"
                    options={Object.keys(commitment)}
                    value={(e) => { setSelectedTeam(e) }} />
            </div>
            <div className='mt-5'></div>
            <div className="bg-white" id='commitment-chart'>
                <ResponsiveContainer height={400}>
                    <ComposedChart data={chartData}>
                        <CartesianGrid stroke="#ccc" />
                        <Tooltip />
                        <Legend verticalAlign="top" layout="vertical" align="right" wrapperStyle={{ paddingLeft: "10px" }} />
                        <Bar dataKey="estimated" fill="#537dc1" />
                        <Bar dataKey="completed" fill="#21ab92" />
                        <Line type="monotone" dataKey="error" stroke="#fb5168" strokeWidth={4} dot={{ stroke: '#fb5168', strokeWidth: 2 }} />
                        <Line type="monotone" dataKey="avg" stroke="#cccccc" strokeWidth={4} dot={false} strokeDasharray="4 4" />
                        <XAxis dataKey="name" />
                        <YAxis />
                    </ComposedChart >
                </ResponsiveContainer>
            </div>
            <Button.SaveAsPNG icon="????" text="Download Chart" node="commitment-chart" fileName="commitment-chart" />
        </div>
    );
}


export default Commitment;
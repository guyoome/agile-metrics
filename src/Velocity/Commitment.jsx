import React, { useEffect, useState } from 'react';
import Teams from '../utils/Teams';
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

    useEffect(() => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Basic ${process.env.REACT_APP_ATLASSIAN_AUTH}`);
        myHeaders.append("Cookie", `atlassian.xsrf.token=${process.env.REACT_APP_TOKEN}`);
        myHeaders.append("Accept", "application/json")

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        for (const team of Teams.list) {
            fetch(`${process.env.REACT_APP_PROXY}/https://spolio.atlassian.net/rest/greenhopper/1.0/rapid/charts/velocity.json?rapidViewId=${team.id}`, requestOptions)
                .then(res => res.json())
                .then(result => {
                    console.log("test > id:", team.id, " > ", result);
                    setData(prevData => ({ ...prevData, [team.tag]: Object.values(result.velocityStatEntries) }));
                })
                .catch(error => console.log('error', error));
        }

    }, [])

    useEffect(() => {
        console.log("🎆 Update", data);
        // console.log("data:", Object.keys(data).length, " - teams:", Teams.list.length);
        if (Object.keys(data).length === Teams.list.length) {
            console.log("🎆 Final Update");
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const team = data[key];
                    // console.log("team:", team)
                    const teamVariance = [];
                    team.forEach(sprint => {
                        // console.log("estimated:",sprint.estimated.value,"actual:",sprint.completed.value)
                        teamVariance.push(variance(sprint.estimated.value, sprint.completed.value))
                    });
                    setCommitment(prevCommitment => ({ ...prevCommitment, [key]: teamVariance }));
                }
            }
            // for (const team of data) {
            //     console.log("team:",team)

            // setCommitment(prevCommitment => ({ ...prevData, [team.tag]: result }));
            // }
        }
    }, [data])


    // Dynamic state
    // setState(prevState => ({ ...prevState, [name]: value }));
    return (
        <div style={{ textAlign: "start" }}>
            <h1>Commitment</h1>
            <div className='data-table' id='agile-health-check-table'>
                <table >
                    <thead>
                        <tr>
                            {Object.keys(commitment).map((e, id) => (
                                <th key={id}>{e}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className='am-data-table__content'>
                        {Object.values(commitment).map((e, id) => (
                            <td key={id}>{Math.round(average(e)*100)/100}</td>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default Commitment;
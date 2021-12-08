/**
 * Get the list of epic summaries not done
 * @param {Array} epics - List of epics
 * @returns {Array} summaries
 */
const getNotDoneEpicsSummary = (epics) => {
    const summaries = [];
    epics.forEach(epic => {
        if (epic.done === false) {
            summaries.push(epic.summary)
        }
    });
    return summaries;
}


/**
 * Get the epic that have a specific summary
 * @param {Array} epics - List of epics
 * @param {String} summary - Summary to find an epic
 * @returns {Object} epicBySummary
 */
const getEpicBySummary = (epics, summary) => {
    let epicBySummary = "";
    epics.forEach(epic => {
        if (summary === epic.summary) {
            epicBySummary = epic;
        }
    });
    return epicBySummary;
}


const getScope = (sprints, history) => {
    const scope = new Array(sprints.length);
    scope.fill(0);

    Object.entries(history).forEach(([key, value]) => {
        if (value[0].added) {
            for (let i = 0; i < sprints.length; i++) {
                const sprint = sprints[i];

                if (key >= sprint.startTime && key < (typeof sprints[i + 1] !== 'undefined' ? sprints[i + 1].startTime : sprint.endTime)) {
                    scope[i]++;
                    break;
                }
            }
        }
    })


    // Do the Sum for the scope: [0,1,2,0,1] => [0,1,3,3,4]
    scope.forEach((elementValue, i) => {
        scope[i] = { name: sprints[i].name, value: elementValue }
        scope[i].value = (scope[i - 1] ? scope[i - 1].value + elementValue : elementValue);
    });

    return scope;
}


const getDoneIssues = (sprints, history) => {
    const doneIssues = new Array(sprints.length);
    doneIssues.fill(0);

    Object.entries(history).forEach(([key, value]) => {
        if ((typeof value[0].column !== 'undefined') && (value[0].column.done)) {
            for (let i = 0; i < sprints.length; i++) {
                const sprint = sprints[i];
                if (key >= sprint.startTime && key < (typeof sprints[i + 1] !== 'undefined' ? sprints[i + 1].startTime : sprint.endTime)) {
                    doneIssues[i]++;
                    break;
                }
            }
        }
    })

    // Do the Sum for the scope: [0,1,2,0,1] => [0,1,3,3,4]
    doneIssues.forEach((elementValue, i) => {
        doneIssues[i] = { name: sprints[i].name, value: elementValue }
        doneIssues[i].value = (doneIssues[i - 1] ? doneIssues[i - 1].value + elementValue : elementValue);
    });

    return doneIssues;
}

const getStartSprint = (quarter, sprints, date = new Date()) => {
    // quarter === 1/2/3/4
    // 1 - Janvier/Fevrier/Mars
    // 2 - Avril/Mai/Juin
    // 3 - Juillet/Aout/Septembre
    // 4 - Octobre/Novembre/Decembre
    // new Date(year,monthID,day)

    let firstDayOfQuarter = new Date(date.getFullYear(), 0).getTime()
    switch (quarter) {
        case 4:
            firstDayOfQuarter = new Date(date.getFullYear(), 9).getTime()
            // return 01/10/today.year
            break;
        case 3:
            firstDayOfQuarter = new Date(date.getFullYear(), 6).getTime()
            // return 01/07/today.year
            break;
        case 2:
            firstDayOfQuarter = new Date(date.getFullYear(), 3).getTime()
            // return 01/04/today.year 
            break;
        default:
            break;
    }

    let startSprint = sprints[0];

    for (let i = 0; i < sprints.length; i++) {
        const sprint = sprints[i];

        if (firstDayOfQuarter <= sprint.startTime && firstDayOfQuarter > (typeof sprints[i - 1] !== 'undefined' ? sprints[i - 1].startTime : sprint.startTime)) {
            startSprint = sprint;
            break;
        }
    }

    return startSprint;
}


/**
 * Assign the project to an employee.
 * @param {Array} employee - The employee who is responsible for the project.
 * @param {string} employee.name - The name of the employee.
 * @param {string} employee.department - The employee's department.
 */
const getChartDataBegin = (chartDataSet, startSprint) => {

    const sliceStart = chartDataSet.findIndex((element) => (
        element.name === startSprint.name
    ));

    return chartDataSet.slice(sliceStart);
}


const getAverageDoneBySprint = (sprints, history, interval = 5) => {
    const chartDataSet = getChartDataSet(sprints, history, 0);

    let totalDoneIssues = 0;
    let totalSprints = chartDataSet.length;

    chartDataSet.forEach((element, i) => {
        const done = element.doneIssues - (i === 0 ? 0 : chartDataSet[i - 1].doneIssues);
        totalDoneIssues += done;
        if (element.doneIssues === 0) {
            totalSprints--;
        }
    });

    const averageDoneBySprint = totalDoneIssues / totalSprints;

    return averageDoneBySprint;
}

const getForecast = (forecastScope, chartDataSet, sprints, history, velocity) => {
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

    const scope = getScope(sprints, history);

    const initStartTime = chartDataSet.at(-1).startTime;

    forecast.forEach((element, i) => {
        forecast[i] = {
            name: element.name + (lastSprintID + 1),
            scope: scope.at(-1).value,
            startTime: initStartTime + 1209600000 * (i + 1),
        }
        lastSprintID++

    });

    const avg = getAverageDoneBySprint(sprints, history);


    // init the first value
    const initDoneIssues = chartDataSet.at(-1).doneIssues;

    forecast.forEach((element, i) => {
        forecast[i].forecast = (i > 0 ? (forecast[i - 1].forecast + avg) : (initDoneIssues + avg))
        forecast[i].forecast = Math.round(forecast[i].forecast)
    });

    return forecast;
}

const sum = (array) => {
    return array.reduce((a, b) => a + b, 0);
}

const average = (array) => {
    // const tot = sum(array);
    return (sum(array) / array.length) || 0;
}

const getForecastInterval = (chartDataSet, interval, forecast, sprints, history) => {
    console.log("🤑chartDataSet in getForecastInterval🤑", chartDataSet);

    const avg = getAverageDoneBySprint(sprints, history);

    // Get 5 last sprints
    const removeForecast = chartDataSet.slice(0, -forecast);
    let deviation = removeForecast.slice(-interval);
    console.log("🤑Get 5 last sprints🤑", deviation);

    // Avg of 5 last sprints - µ
    let calcDeviation = [];
    deviation.forEach(element => {
        calcDeviation.push(element.doneIssues);
    });
    deviation = calcDeviation;
    calcDeviation = [];

    const mu = average(deviation);
    console.log("🤑Avg of 5 last sprints - µ🤑", mu);

    // |xi - µ|²
    deviation.forEach((element, i) => {
        const calc = element - mu;
        calcDeviation.push(calc * calc)
    });
    console.log("🤑|xi - µ|²🤑", calcDeviation);

    // Sum |xi - µ|²
    const sumCalcDeviation = sum(calcDeviation);
    console.log("🤑Sum |xi - µ|²🤑", sumCalcDeviation);

    // Sum |xi - µ|² / Tot(5)
    const avgSumCalcDeviation = sumCalcDeviation / deviation.length;
    console.log("🤑 Sum |xi - µ|² / Tot(5)🤑", avgSumCalcDeviation);

    // sqrt(Sum |xi - µ|² / Tot(5))
    deviation = Math.sqrt(avgSumCalcDeviation);
    console.log("🤑 Deviation 🤑", deviation);

    chartDataSet.forEach((element, i) => {
        if (element.forecast) {
            if (element.forecast !== element.doneIssues) {
                // chartDataSet[i].forecastLow = element.forecast * (1 - interval / 100);
                chartDataSet[i].forecastLow = chartDataSet[i - 1].forecastLow - (avg - deviation);
                chartDataSet[i].forecastLow = Math.round(chartDataSet[i].forecastLow);

                // chartDataSet[i].forecastHigh = element.forecast * (1 + interval / 100);
                chartDataSet[i].forecastHigh = chartDataSet[i - 1].forecastHigh + (avg + deviation);
                chartDataSet[i].forecastHigh = Math.round(chartDataSet[i].forecastHigh);

            } else {
                chartDataSet[i].forecastLow = element.doneIssues;
                chartDataSet[i].forecastHigh = element.doneIssues;
            }
        }
    });

    return chartDataSet;
}

const getSprints = (sprintsList) => {
    const sprints = [];
    sprintsList.forEach(element => {
        sprints.push(element.name)
    });

    return sprints.slice(-20);
}

const getChartDataSetWithForecast = (sprints, history, chartDataSet, forecast = 0) => {
    let chartDataSetWithForecast = chartDataSet;
    // forecast start at the end of doneIssues Line
    chartDataSetWithForecast.at(-1).forecast = chartDataSet.at(-1).doneIssues;

    // Enrich with avg Forecast
    chartDataSetWithForecast = chartDataSetWithForecast.concat(getForecast(forecast, chartDataSetWithForecast, sprints, history));

    // Enrich with high & low forecast
    chartDataSetWithForecast = getForecastInterval(chartDataSetWithForecast, 5, forecast, sprints, history);

    return chartDataSetWithForecast;
}

const getChartDataSetWithQuarter = (chartDataSet) => {
    let chartDataSetWithQuarter;

    chartDataSetWithQuarter = chartDataSet;

    const firstsSprintQuarter = []
    const years = [];

    chartDataSetWithQuarter.forEach(element => {
        const elementYear = new Date(element.startTime).getFullYear();
        if (years.indexOf(elementYear.toString()) === -1) {
            years.push(elementYear.toString());
        }
    });



    for (let j = 0; j < years.length; j++) {
        for (let index = 0; index < 4; index++) {
            firstsSprintQuarter.push(getStartSprint(index + 1, chartDataSetWithQuarter, new Date(years[j])))

        }
    }


    for (let i = 1; i < chartDataSetWithQuarter.length; i++) {
        const sprint = chartDataSetWithQuarter[i];

        for (let j = 0; j < firstsSprintQuarter.length; j++) {
            const firstSprintQuarter = firstsSprintQuarter[j];

            if (firstSprintQuarter.name === sprint.name) {
                chartDataSetWithQuarter[i].quarter = Math.max.apply(Math, chartDataSetWithQuarter.map(function (o) { return o.scope; }));
                chartDataSetWithQuarter[i].quarterlabel = "Q".concat(j % 4 + 1);
            }
        }
    }

    return chartDataSetWithQuarter;
}


/**
 * Get the Data set to print a chart with Rechart
 * @param {Array} sprints - list of a team sprints
 * @param {Object} history - history of tickets
 * @param {Number} quarterStrat - The beginning of the chart data set 
 */
const getChartDataSet = (sprints, history) => {

    let chartDataSet = [];

    const scope = getScope(sprints, history);
    const doneIssues = getDoneIssues(sprints, history);

    for (let i = 0; i < sprints.length; i++) {
        chartDataSet.push({
            name: scope[i].name,
            scope: scope[i].value,
            doneIssues: doneIssues[i].value,
            startTime: sprints[i].startTime
        })
    }


    // if (sprintStart) {
    //     chartDataSet = getChartDataBegin(chartDataSet, { name: sprintStart });
    // }

    return chartDataSet;
}

export {
    getSprints,
    getNotDoneEpicsSummary,
    getEpicBySummary,
    getChartDataSet,
    getChartDataBegin,
    getChartDataSetWithForecast,
    getChartDataSetWithQuarter
}
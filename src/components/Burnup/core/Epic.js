const Epic = {

    /**
     * Get the list of epic summaries not done
     * @param {Array} epics - List of epics
     * @returns {Array} summaries
     */
    getNotDoneEpicsSummary: function (epics) {
        const summaries = [];
        epics.forEach(epic => {
            if (epic.done === false) {
                summaries.push(epic.summary)
            }
        });
        return summaries;
    },

    /**
     * Get the epic that have a specific summary
     * @param {Array} epics - List of epics
     * @param {String} summary - Summary to find an epic
     * @returns {Object} epicBySummary
     */
    getEpicBySummary: function (epics, summary) {
        let epicBySummary = "";
        epics.forEach(epic => {
            if (summary === epic.summary) {
                epicBySummary = epic;
            }
        });
        return epicBySummary;
    },

    getScope: function (sprints, history) {
        const scope = new Array(sprints.length);
        scope.fill(0);

        Object.entries(history).forEach(([key, value]) => {
            if (value[0].added) {
                sprints.forEach((sprint, i) => {
                    if (key >= sprint.startTime && key < (typeof sprints[i + 1] !== 'undefined' ? sprints[i + 1].startTime : sprint.endTime)) {
                        scope[i]++;
                        // We can add abreak here /!\
                    }
                });
            }
        })


        // Do the Sum for the scope: [0,1,2,0,1] => [0,1,3,3,4]
        scope.forEach((elementValue, i) => {
            scope[i] = { name: sprints[i].name, value: elementValue }
            scope[i].value = (scope[i - 1] ? scope[i - 1].value + elementValue : elementValue);
        });

        return scope;
    },

    getDoneIssues: function (sprints, history) {
        const doneIssues = new Array(sprints.length);
        doneIssues.fill(0);

        Object.entries(history).forEach(([key, value]) => {
            if ((typeof value[0].column !== 'undefined') && (value[0].column.done)) {
                sprints.forEach((sprint, i) => {
                    if (key >= sprint.startTime && key < (typeof sprints[i + 1] !== 'undefined' ? sprints[i + 1].startTime : sprint.endTime)) {
                        doneIssues[i]++;
                        // We can add abreak here /!\
                    }
                });
            }
        })

        // Do the Sum for the scope: [0,1,2,0,1] => [0,1,3,3,4]
        doneIssues.forEach((elementValue, i) => {
            doneIssues[i] = { name: sprints[i].name, value: elementValue }
            doneIssues[i].value = (doneIssues[i - 1] ? doneIssues[i - 1].value + elementValue : elementValue);
        });

        return doneIssues;
    },

    getStartSprint: function (quarter, sprints) {
        // quarter === 1/2/3/4
        // 1 - Janvier/Fevrier/Mars
        // 2 - Avril/Mai/Juin
        // 3 - Juillet/Aout/Septembre
        // 4 - Octobre/Novembre/Decembre
        // new Date(year,monthID,day)

        const today = new Date();
        let firstDayOfQuarter = new Date(today.getFullYear(), 0).getTime()
        switch (quarter) {
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

        let startSprint = sprints[0];

        sprints.forEach((sprint, i) => {
            if (firstDayOfQuarter <= sprint.startTime && firstDayOfQuarter > (typeof sprints[i - 1] !== 'undefined' ? sprints[i - 1].startTime : sprint.startTime)) {
                startSprint = sprint;
                // We can add abreak here /!\
            }
        });

        return startSprint;
    },

    /**
     * Assign the project to an employee.
     * @param {Array} employee - The employee who is responsible for the project.
     * @param {string} employee.name - The name of the employee.
     * @param {string} employee.department - The employee's department.
     */
    getChartDataBegin: function (chartDataSet, startSprint) {

        const sliceStart = chartDataSet.findIndex((element) => (
            element.name === startSprint.name
        ));
        return chartDataSet.slice(sliceStart);
    },

    /**
     * Get the Data set to print a chart with Rechart
     * @param {Array} sprints - list of a team sprints
     * @param {Object} history - history of tickets
     * @param {Number} quarterStrat - The beginning of the chart data set 
     */
    getChartDataSet: function (sprints, history, quarterStart) {
        let chartDataSet = [];

        const scope = this.getScope(sprints, history);
        const doneIssues = this.getDoneIssues(sprints, history);

        for (let i = 0; i < sprints.length; i++) {
            chartDataSet.push({
                name: scope[i].name,
                scope: scope[i].value,
                doneIssues: doneIssues[i].value
            })
        }

        const startSprint = this.getStartSprint(quarterStart, sprints);

        return this.getChartDataBegin(chartDataSet, startSprint);;
    },
}

export default Epic;
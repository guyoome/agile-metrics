
const editTimeline = (startDate, columns) => {
    const start = parseInt(startDate)
    let obj = {}

    const columnFormat = new Array(columns.length);
    columnFormat.fill(0);

    for (var arr = [], dt = new Date(start); dt <= Date.now(); dt.setDate(dt.getDate() + 1)) {

        obj[generateDateFormat(dt)] = { column: columnFormat.slice() };
    }

    obj[generateDateFormat(Date.now())] = { column: columnFormat.slice() };

    return obj;
}

/**
 * Return a timestamp in the format needed: JJ/MM/AAAA
 * @param {Number} timestamp - timestamp in ms
 * @returns {String} A string is returned
 */
const generateDateFormat = (timestamp) => {
    const date = new Date(timestamp);
    return (`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`)
}


const editData = (history, timeline, columns) => {
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

    for (let day = 0; day < arr.length; day++) {
        const element = arr[day];
        for (let column = 0; column < columns.length; column++) {
            arr[day][column] = (arr[day - 1] ? arr[day - 1][column] + element[column] : element[column]);

        }
    }

    return arr;

}

const editWip = (data, columns) => {
    const arr = [];

    for (let day = 0; day < data.length; day++) {
        const element = data[day];
        let wip = 0;
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.active) {
                wip += element[i]
            }
        }

        arr.push({
            date: element.date,
            wip
        })
    }

    return arr;
}

const editThroughput = (data, columns) => {
    const arr = [];
    // create arr with obj { start:done, end:done } by week (7days)
    let mem = 0;

    const doneIndex = columns.length - 1; // -1 for max id in the array

    data.forEach((element, id) => {
        if (id % 7 === 0) {

            arr.push({ throughput: element[doneIndex] - mem, date: element.date });
            mem = element[doneIndex];
        }
    });

    return arr;

}

/**
 * Return an Array with a new attribute containing the average
 * @param {Array[Object]} arr - Array you want a copy with average of it - [{..., key}]
 * @param {string} key - Key of the attribute you want to calculate average
 * @returns {Array} An Array with an average attribute is returned - [{..., key, avgOfKey}]
 */
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

export {
    editTimeline,
    editData,
    editWip,
    editThroughput,
    avg
}
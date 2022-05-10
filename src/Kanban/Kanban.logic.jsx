
const editTimeline = (startDate) => {
    const start = parseInt(startDate)
    let obj = {}

    for (var arr = [], dt = new Date(start); dt <= Date.now(); dt.setDate(dt.getDate() + 1)) {

        obj[generateDateFormat(dt)] = { column: [0, 0, 0, 0, 0, 0] };
    }
    obj[generateDateFormat(Date.now())] = { column: [0, 0, 0, 0, 0, 0] };

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


const editData = (history, timeline) => {
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
    arr.forEach((element, i) => {
        arr[i][0] = (arr[i - 1] ? arr[i - 1][0] + element[0] : element[0]);
        arr[i][1] = (arr[i - 1] ? arr[i - 1][1] + element[1] : element[1]);
        arr[i][2] = (arr[i - 1] ? arr[i - 1][2] + element[2] : element[2]);
        arr[i][3] = (arr[i - 1] ? arr[i - 1][3] + element[3] : element[3]);
        arr[i][4] = (arr[i - 1] ? arr[i - 1][4] + element[4] : element[4]);
        arr[i][5] = (arr[i - 1] ? arr[i - 1][5] + element[5] : element[5]);
    });

    return arr;

}

const editWip = (data) => {
    const arr = [];

    data.forEach(element => {
        arr.push({
            date: element.date,
            wip: element[3] + element[4]
        })
    });

    return arr;
}

const editThroughput = (data) => {
    const arr = [];
    // create arr with obj { start:done, end:done } by week (7days)
    let mem = 0;
    data.forEach((element, id) => {
        if (id % 7 === 0) {

            arr.push({ throughput: element[5] - mem, date: element.date });
            mem = element[5];
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
import React, { useEffect, useState } from 'react';
import Teams from '../utils/Teams';
import * as Button from "../components/Button";

const getLayoutStyle = () => ({

})

const CSVToArray = (str) => {
    var arr = [];
    var quote = false;  // 'true' means we're inside a quoted field

    // replace all separator with ,
    const strCopy = str.replaceAll(";", ",");

    // Iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < strCopy.length; c++) {
        var cc = strCopy[c], nc = strCopy[c + 1];        // Current character, next character
        arr[row] = arr[row] || [];             // Create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }

    return arr;
}


function Import() {
    const [file, setFile] = useState();
    const [header, setHeader] = useState();
    const [array, setArray] = useState([]);

    const fileReader = new FileReader();

    useEffect(() => {
        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;
                const array = CSVToArray(text)
                setHeader(array.shift());
                setArray(array);
                // console.log("Slice tst header:", CSVToArray(text).slice(0, 1))
            };

            fileReader.readAsText(file);
        }
    }, [file])

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };


    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;
                setArray(CSVToArray(text));
            };

            fileReader.readAsText(file);
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h1>REACTJS CSV IMPORT EXAMPLE </h1>
            <form>
                <input
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                />

                <button
                    onClick={(e) => {
                        handleOnSubmit(e);
                    }}
                >
                    IMPORT CSV
                </button>
            </form>

            <br />

            <table>
                <thead>
                    <tr>
                        {header && header.map((key) => (
                            <th>{key}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {array.slice(1).map((item) => (
                        <tr key={item.id}>
                            {Object.values(item).map((val) => (
                                <td style={{ whiteSpace: "pre-line" }}>{val}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


export default Import;
import React, { useState } from 'react';
import { Bar } from "react-chartjs-2";
import { getRandomColorArray } from './utils';


export default function Graph(props) {
    const { toggle } = props;

    const handleClick = () => {
        toggle();
    };

    var chartData = {
        labels: ["Rock", "Pop", "Rap", "Folk", "Indie", "Classical", "Lofi", "Jazz"],
        datasets: [{
            label: "Genre",
            data: [10, 12, 14, 9, 22, 15, 2, 17],
            backgroundColor: getRandomColorArray(8),
            borderWidth: 2,

        }],

    }

    const[graphData, setGraphData] = useState(chartData)

    return (
        <div className="Graph">
            <span className="PopoutWindow-close" onClick={handleClick}>close</span>
            <Bar
                data={graphData}
                option={{       
                }}/>
        </div>
        )
}
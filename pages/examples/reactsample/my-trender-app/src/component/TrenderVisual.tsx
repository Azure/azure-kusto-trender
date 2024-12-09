import KustoTrender from 'azure-kusto-trender/kustotrender';
import 'azure-kusto-trender/kustotrender.css';
import React from 'react';
const data: any[] = [];
const from = new Date(Math.floor(new Date().valueOf() / (1000 * 60 * 60)) * 1000 * 60 * 60);
let to;
for (let i = 0; i < 3; i++) {
    const lines: any = {};
    data.push({ [`Factory${i}`]: lines });
    for (let j = 0; j < 5; j++) {
        const values: any = {};
        lines[`Station${j}`] = values;
        for (let k = 0; k < 60; k++) {
            if (!(k % 2 && k % 3)) {
                // Sparse data check
                to = new Date(from.valueOf() + 1000 * 60 * k);
                const val = Math.random();
                const val2 = Math.random();
                const val3 = Math.random();
                const val4 = Math.random();
                values[to.toISOString()] = { avg: val, x: val2, y: val3, r: val4 };
            }
        }
    }
}

const options = {
    timestamp: new Date().toISOString(), // Use the current time, or provide a specific timestamp
    theme: 'light', // Example of other options you might want to pass
    stacked: true, // Example option (if your chart can be stacked)
    legend: 'compact', // Another example option
};

export default function TrenderVisual() {
    const chartRef = React.useRef<HTMLDivElement | null>(null); // Ref for the div element
    if (chartRef.current) {
        const kustoTrender = new KustoTrender();
        const lineChart = new kustoTrender.ux.LineChart(chartRef.current);
        try {
            lineChart.render(data, options);
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div style={{ overflowY: 'auto' }}>
            <div id="chart" ref={chartRef} style={{ height: '400px' }}></div>
        </div>
    );
};

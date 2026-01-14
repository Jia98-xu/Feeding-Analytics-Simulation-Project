import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Feeding} from '../types/Feeding';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    TimeScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, PointElement, TimeScale, LinearScale, Tooltip, Legend, zoomPlugin);

interface Props{
    data: Feeding[];
}

const FeedingChart: React.FC<Props> = ({ data }) => {
    const chartRef = useRef<any>(null);

    useEffect(() => {
        const canvas = chartRef.current?.canvas;
        if(!canvas) return;
        const handleRightClick = (event: MouseEvent) => {
            event.preventDefault();
            const chart = chartRef.current;
            if (chart) {
                chart.resetZoom();
            }
        };

        canvas.addEventListener('contextmenu', handleRightClick);

        return () => {
            canvas.removeEventListener('contextmenu', handleRightClick);
        };
    }, []);

    if (!data || data.length === 0) {
        return <div style={{ height:'300px', display:'flex', alignItems:'center', justifyContent:'center' }}>
        No data to display
        </div>;
    }

    const sortData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const charData: ChartData<'line'> = {
        labels: sortData.map(item => new Date(item.timestamp)),
        datasets:[
            {
                label: 'Activity_level',
                data: sortData.map(item => item.activity_level),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        scales:{
            x:{
                type: 'time',
                time: {
                    tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
                    unit: 'minute',
                    displayFormats: {
                        minute: 'MM/dd HH:mm',
                        hour: 'MM/dd HH:mm',
                    },
                },
            },
            y:{ beginAtZero: true },
        },
        plugins: {
            legend: { display: true},
            tooltip: { enabled: true},
            zoom:{
                pan:{
                    enabled: true, 
                    mode: 'x',
                },
                zoom: {
                    wheel: { enabled: true},
                    pinch: { enabled: true},
                    mode: 'x',
                },
            },
        },
    };

    return <Line ref={chartRef} data={charData} options={options} />;
};
export default FeedingChart;

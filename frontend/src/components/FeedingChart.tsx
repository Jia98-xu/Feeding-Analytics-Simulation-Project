import React from 'react';
import { Line } from 'react-chartjs-2';
import { Feeding} from '../types/Feeding';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,

} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props{
    data: Feeding[];
}

const FeedingChart: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div style={{ height:'300px', display:'flex', alignItems:'center', justifyContent:'center' }}>
        No data to display
        </div>;
    }

    const labels = data.map(item => new Date(item.timestamp).toLocaleTimeString());
    const charData = {
        labels,
        datasets:[
            {
                label: 'Activity_level',
                data: data.map(item => item.activity_level) ,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        scales:{
            y:{ beginAtZero: true },
        },
    };

    return <Line data={charData} options={options} />;
};
export default FeedingChart;

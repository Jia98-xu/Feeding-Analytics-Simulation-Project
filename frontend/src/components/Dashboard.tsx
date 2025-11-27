import React, { useEffect, useState } from 'react';
import FeedingChart from './FeedingChart';
import SummaryCards from './SummaryCards';

import { 
    fetchFeedings,
    fetchSimulatorStatus,
    fetchStats, 
    startSimulator, 
    stopSimulator
} from '../api/api';

import { Feeding } from '../types/Feeding';
import { Stats } from '../types/Stats';
import { SimulatorStatus } from '../types/SimulatorStatus';

const Dashboard: React.FC = () => {
    const [feedings, setFeedings] = useState<Feeding[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [simStatus, setSimStatus] = useState<SimulatorStatus>({ running: false });
    const [loading, setLoading] = useState(false)

    //loading all data
    const loadAllData = async () => {
        try {
            const [f, s, status] = await Promise.all([
                fetchFeedings(),
                fetchStats(),
                fetchSimulatorStatus()
            ]);
            console.log("Fetched feedings:", f);
            setFeedings(f);
            setStats(s);
            setSimStatus(status);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    //Initialization and periodic refresh
    useEffect(() => {
        loadAllData();
        const timer = setInterval(loadAllData, 5000);
        return () => clearInterval(timer);
    }, []);

    //Start simulator
    const handleStart = async () => {
        setLoading(true);
        try{
            await startSimulator();
            setSimStatus({ running: true });
        } finally {
            setLoading(false);
        }
    };

    //Stop simulator
    const handleStop = async () => {
        setLoading(true);
        try{
            await stopSimulator();
            setSimStatus({ running: false });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style = {{ marginBottom: '20px' }}>Feeding Analysis System Dashboard</h1>

            {/* Simulator Control Buttons */}
            <div style={{ marginBottom: '20px'}}>
                <button
                    onClick={handleStart}
                    disabled={simStatus.running || loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: simStatus.running ? '#aaa' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        marginRight: '10px',
                        cursor: simStatus.running ? 'not-allowed' : 'pointer'
                    }}
                >
                    Start Simulator
                </button>

                <button
                    onClick={handleStop}
                    disabled={!simStatus.running || loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: !simStatus.running ? '#aaa' : '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: !simStatus.running ? 'not-allowed' : 'pointer'
                    }}
                >
                    Stop Simulator
                </button>

                <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>
                    Status: {''}
                    <span style={{ color: simStatus.running ? 'green' : 'red' }}>
                        {simStatus.running ? 'Running' : 'Stopped'}
                    </span>
                </span>
            </div>
            {/* Summary Cards */}
            <SummaryCards data={feedings} />

            {/* Feeding Chart */}
            <div style={{ marginTop: '40px' }}>
                <FeedingChart data={feedings} />
            </div>
        </div>
    );
};

export default Dashboard;
import axios from 'axios';

import { Feeding } from '../types/Feeding';
import { Stats } from '../types/Stats';
import { Alerts } from '../types/Alerts';
import { SimulatorStatus } from '../types/SimulatorStatus';

//创建axios实例
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

//喂食数据接口
export const fetchFeedings = async (): Promise<Feeding[]> => {
    const res = await api.get<Feeding[]>('/feedings/');
    return res.data;
};
//统计数据接口
export const fetchStats = async (): Promise<Stats> => {
    const res = await api.get<Stats>('/feeding-stats/');
    return res.data;
};
//警报数据接口
export const fetchAlerts = async (): Promise<Alerts[]> => {
    const res = await api.get<Alerts[]>('/feeding-alerts/');
    return res.data;
};
//模拟器状态接口
export const fetchSimulatorStatus = async (): Promise<SimulatorStatus> => {
    const res = await api.get<SimulatorStatus>('/feeding-simulator/status/');
    return res.data;
};
//启动模拟器
export const startSimulator = async (): Promise<void> => {
    await api.post('/feeding-simulator/start/');
};
//停止模拟器
export const stopSimulator = async (): Promise<void> => {
    await api.post('/feeding-simulator/stop/');
};

export default api;

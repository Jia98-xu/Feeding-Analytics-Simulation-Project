import React from 'react';
import { Feeding } from '../types/Feeding';

interface Props {
    data: Feeding[];
}

const SummaryCards: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) return <div style={{ textAlign: 'center', padding: 20}}>No data</div>;

    const values = data.map(item => item.activity_level);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    // 确保样式类型正确
    const cardStyle: React.CSSProperties = {
        padding: '20px',
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        minWidth: 120,
        textAlign: 'center',
    };

    const numberStyle: React.CSSProperties = {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: '#2c7be5',
        marginTop: 8,
    };

    return (
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={cardStyle}>
                <div>Max</div>
                <div style={numberStyle}>{max.toFixed(2)}</div>
            </div>

            <div style={cardStyle}>
                <div>Min</div>
                <div style={numberStyle}>{min.toFixed(2)}</div>
            </div>

            <div style={cardStyle}>
                <div>Avg</div>
                <div style={numberStyle}>{avg.toFixed(2)}</div>
            </div>
        </div>
    );
};

export default SummaryCards;

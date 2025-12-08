import { Card } from '../../components/common/Card';

export const History = () => {
    const history = [
        { id: 1, activity: 'Neck Stretches', date: 'Oct 24, 2025', time: '10:30 AM', duration: '2 min' },
        { id: 2, activity: 'Eye Relief', date: 'Oct 24, 2025', time: '02:15 PM', duration: '2 min' },
        { id: 3, activity: 'Shoulder Rolls', date: 'Oct 23, 2025', time: '11:00 AM', duration: '1 min' },
        { id: 4, activity: 'Desk Yoga', date: 'Oct 23, 2025', time: '04:45 PM', duration: '3 min' },
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Activity History</h1>
            <Card>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Activity</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Time</th>
                            <th style={{ padding: '1rem' }}>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{item.activity}</td>
                                <td style={{ padding: '1rem' }}>{item.date}</td>
                                <td style={{ padding: '1rem' }}>{item.time}</td>
                                <td style={{ padding: '1rem' }}>{item.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

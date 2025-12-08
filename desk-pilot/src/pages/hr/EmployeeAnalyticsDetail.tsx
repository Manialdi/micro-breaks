import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { dbService } from '../../services/databaseService';
import { supabase } from '../../lib/supabase';

export const EmployeeAnalyticsDetail = () => {
    const { employeeId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (employeeId) loadData();
    }, [employeeId]);

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: dbUser } = await supabase.from('users').select('company_id').eq('id', user.id).single();
                if (dbUser?.company_id && employeeId) {
                    const stats = await dbService.getEmployeeDetailAnalytics(employeeId, dbUser.company_id);
                    setData(stats);
                } else {
                    setError('Unauthorized or missing company');
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to load employee data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading details...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
    if (!data) return <div style={{ padding: '2rem' }}>No data found.</div>;

    const maxTrend = Math.max(...data.trendData.map((d: any) => d.count), 1);

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/hr/analytics">
                    <Button variant="outline" size="sm">&larr; Back to Overview</Button>
                </Link>
            </div>

            {/* 1. Header Card */}
            <Card style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{data.user.name}</h1>
                        <div style={{ color: 'var(--text-muted)' }}>{data.user.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Current Streak</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>
                                {data.stats.streak} <span style={{ fontSize: '1rem' }}>days</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Sessions</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                                {data.stats.totalSessions}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 2. Line Chart (Last 30 Days) */}
            <Card title="Activity (Last 30 Days)" style={{ marginBottom: '2rem' }}>
                <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '4px', paddingTop: '1rem', overflowX: 'auto' }}>
                    {data.trendData.map((d: any, i: number) => {
                        const height = (d.count / maxTrend) * 100;
                        const showLabel = i % 3 === 0; // Prevent clutter
                        return (
                            <div key={i} style={{ flex: 1, minWidth: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    width: '80%',
                                    height: `${height}%`,
                                    background: 'var(--primary)',
                                    opacity: 0.8,
                                    borderRadius: '2px 2px 0 0',
                                    minHeight: d.count > 0 ? '4px' : '0'
                                }} title={`${d.date}: ${d.count} sessions`} />
                                {showLabel && (
                                    <div style={{ fontSize: '0.7rem', marginTop: '6px', color: '#94a3b8', transform: 'rotate(-45deg)' }}>
                                        {d.date.slice(5)}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* 3. Breakdown Table */}
            <Card title="Exercise Breakdown">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem' }}>Exercise Name</th>
                            <th style={{ padding: '1rem' }}>Sessions Completed</th>
                            <th style={{ padding: '1rem' }}>Last Completed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.breakdown.length === 0 ? (
                            <tr><td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>No exercises yet.</td></tr>
                        ) : data.breakdown.map((ex: any, i: number) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{ex.name}</td>
                                <td style={{ padding: '1rem' }}>{ex.count}</td>
                                <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                                    {new Date(ex.lastAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                All stats are limited to this company only.
            </div>
        </div>
    );
};

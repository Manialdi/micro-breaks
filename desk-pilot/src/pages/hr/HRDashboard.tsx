import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { dbService } from '../../services/databaseService';
import { supabase } from '../../lib/supabase';

interface EmployeeStats {
    id: string;
    name: string;
    email: string;
    status: string;
    sessionsToday: number;
    sessionsWeek: number;
    streak: number;
}

export const HRDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        sessionsToday: 0,
        participationRate: 0
    });
    const [tableData, setTableData] = useState<EmployeeStats[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: dbUser } = await supabase.from('users').select('company_id').eq('id', user.id).single();
                if (dbUser?.company_id) {
                    const stats = await dbService.getHRDashboardStats(dbUser.company_id);
                    setMetrics(stats.metrics);
                    setTableData(stats.tableData);
                }
            }
        } catch (error) {
            console.error('Failed to load dashboard', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = tableData.filter(emp =>
        emp.name.toLowerCase().includes(filter.toLowerCase()) ||
        emp.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Company Wellness Overview</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/hr/analytics">
                        <Button variant="outline">View Detailed Analytics &rarr;</Button>
                    </Link>
                    <Link to="/hr/employees">
                        <Button>+ Manage Employees</Button>
                    </Link>
                </div>
            </div>

            {/* Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card title="Total Employees">
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {metrics.totalEmployees}
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {metrics.activeEmployees} active
                    </p>
                </Card>
                <Card title="Sessions Today">
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {metrics.sessionsToday}
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Company-wide logs</p>
                </Card>
                <Card title="Daily Engagement">
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10b981' }}>
                        {metrics.participationRate}%
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Of active employees</p>
                </Card>
                <Card title="Active Employees">
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f59e0b' }}>
                        {metrics.activeEmployees}
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Target: 100%</p>
                </Card>
            </div>

            {/* Employee Stats Table */}
            <Card title="Employee Performance">
                <div style={{ marginBottom: '1.5rem', maxWidth: '300px' }}>
                    <Input
                        placeholder="Search by name or email..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem' }}>Employee</th>
                                <th style={{ padding: '1rem' }}>Sessions Today</th>
                                <th style={{ padding: '1rem' }}>Last 7 Days</th>
                                <th style={{ padding: '1rem' }}>Current Streak</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        {loading ? 'Loading stats...' : 'No data found Matching filter.'}
                                    </td>
                                </tr>
                            ) : filteredData.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{emp.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            backgroundColor: emp.sessionsToday > 0 ? '#dcfce7' : '#f1f5f9',
                                            color: emp.sessionsToday > 0 ? '#166534' : '#64748b',
                                            fontWeight: 600
                                        }}>
                                            {emp.sessionsToday}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{emp.sessionsWeek}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {emp.streak > 0 ? (
                                            <span style={{ color: '#ea580c', fontWeight: 600 }}>🔥 {emp.streak} days</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

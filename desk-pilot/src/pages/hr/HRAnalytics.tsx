import { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { dbService } from '../../services/databaseService';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/common/Button';

export const HRAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    // Export State
    const [exporting, setExporting] = useState(false);
    const [companyName, setCompanyName] = useState('MyCompany');
    const [showExportSuccess, setShowExportSuccess] = useState(false);

    // Filter State
    const [filterType, setFilterType] = useState('7days'); // today, 7days, 30days, custom
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    useEffect(() => {
        loadAnalytics();
    }, [filterType, customStart, customEnd]);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Get company of HR and Name
                const { data: dbUser } = await supabase
                    .from('users')
                    .select('company_id, companies(name)')
                    .eq('id', user.id)
                    .single();

                if (dbUser?.company_id) {
                    if (dbUser.companies) {
                        // @ts-ignore
                        setCompanyName(dbUser.companies.name || 'Company');
                    }

                    // Calculate Dates
                    let start = '';
                    let end = '';
                    const today = new Date();

                    if (filterType === 'today') {
                        start = today.toISOString().split('T')[0];
                        end = start;
                    } else if (filterType === '7days') {
                        end = today.toISOString().split('T')[0];
                        const d = new Date();
                        d.setDate(d.getDate() - 6);
                        start = d.toISOString().split('T')[0];
                    } else if (filterType === '30days') {
                        end = today.toISOString().split('T')[0];
                        const d = new Date();
                        d.setDate(d.getDate() - 29);
                        start = d.toISOString().split('T')[0];
                    } else if (filterType === 'custom') {
                        if (!customStart || !customEnd) {
                            setLoading(false);
                            return; // Wait for full input
                        }
                        start = customStart;
                        end = customEnd;
                    }

                    const analytics = await dbService.getAnalyticsData(dbUser.company_id, start, end);
                    setData({ ...analytics, rangeLabel: `${start} to ${end}` });
                } else {
                    console.warn('No company found for user');
                }
            }
        } catch (error) {
            console.error('Failed to load analytics', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!data || !data.allEmployees) return;

        setExporting(true);
        try {
            // Define Headers
            const headers = ['Employee Name', 'Email', `Sessions (${data.rangeLabel})`];

            // Map Data
            const rows = data.allEmployees.map((emp: any) => [
                emp.name,
                emp.email,
                emp.sessionsRange
            ]);

            // Convert to CSV
            const csvContent = [
                headers.join(','),
                ...rows.map((row: any[]) => row.map(item => `"${item}"`).join(','))
            ].join('\n');

            // Create Blob and Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            const dateStr = new Date().toISOString().split('T')[0];
            const sanitizedCompanyName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `${sanitizedCompanyName}_wellness_report_${dateStr}.csv`;

            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show Success
            setShowExportSuccess(true);
            setTimeout(() => setShowExportSuccess(false), 3000);

        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setExporting(false);
        }
    };

    if (!data && loading) return <div style={{ padding: '2rem' }}>Loading analytics...</div>;
    if (!data) return <div style={{ padding: '2rem' }}>No data available.</div>;

    // --- Chart Helpers ---
    const maxTrend = data.trendData.length > 0 ? Math.max(...data.trendData.map((d: any) => d.count), 1) : 1;
    const maxBar = data.topPerformers.length > 0 ? Math.max(...data.topPerformers.map((d: any) => d.sessionsRange), 1) : 1;

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '1rem' }}>Company Wellness Overview</h1>

            {/* Filter Bar */}
            <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                </select>

                {filterType === 'custom' && (
                    <>
                        <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} style={{ padding: '0.5rem' }} />
                        <span>to</span>
                        <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} style={{ padding: '0.5rem' }} />
                    </>
                )}

                <div style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#64748b' }}>
                    Showing data for <span style={{ fontWeight: 600 }}>{data.rangeLabel}</span>
                </div>
            </div>

            {/* 1. KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ color: 'var(--text-muted)' }}>Total Employees</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{data.kpis.totalEmployees}</div>
                </Card>
                <Card>
                    <div style={{ color: 'var(--text-muted)' }}>Sessions (In Range)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{data.kpis.sessionsTotal}</div>
                </Card>
                <Card>
                    <div style={{ color: 'var(--text-muted)' }}>Participation (In Range)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: data.kpis.participationRate > 50 ? '#16a34a' : '#d97706' }}>
                        {data.kpis.participationRate}%
                    </div>
                </Card>
            </div>

            {/* 2. Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

                {/* Line Chart (Trend) */}
                <Card title="Activity Trend">
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '2px', paddingTop: '1rem', overflowX: 'auto' }}>
                        {data.trendData.map((d: any, i: number) => {
                            const height = (d.count / maxTrend) * 100;
                            // Show fewer labels if many data points
                            const showLabel = data.trendData.length > 20 ? i % 5 === 0 : true;

                            return (
                                <div key={i} style={{ flex: 1, minWidth: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{
                                        width: '80%',
                                        height: `${height}%`,
                                        background: 'var(--primary)',
                                        opacity: 0.8,
                                        borderRadius: '2px 2px 0 0',
                                        minHeight: d.count > 0 ? '4px' : '0'
                                    }} title={`${d.date}: ${d.count} sessions`} />
                                    {showLabel && (
                                        <div style={{ fontSize: '0.65rem', marginTop: '4px', color: '#94a3b8', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                                            {d.date.slice(5)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Bar Chart (Top Performers) */}
                <Card title="Top Performers (In Range)">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {data.topPerformers.length === 0 ? <p>No activity yet.</p> : data.topPerformers.map((user: any) => (
                            <div key={user.id} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                                <div style={{ width: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </div>
                                <div style={{ flex: 1, background: '#f1f5f9', height: '16px', borderRadius: '8px', margin: '0 1rem', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(user.sessionsRange / maxBar) * 100}%`,
                                        background: '#22c55e',
                                        height: '100%'
                                    }} />
                                </div>
                                <div style={{ width: '30px', textAlign: 'right', fontWeight: 600 }}>
                                    {user.sessionsRange}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* 3. Detailed Table */}
            <Card title="Employee Details">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    {showExportSuccess && <span style={{ marginRight: '1rem', color: '#16a34a', fontWeight: 600, animation: 'fadeIn 0.5s' }}>Export generated successfully.</span>}
                    <Button size="sm" onClick={handleExportCSV} disabled={exporting}>
                        {exporting ? 'Exporting...' : 'Export CSV'}
                    </Button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '0.75rem' }}>Name</th>
                                <th style={{ padding: '0.75rem' }}>Email</th>
                                <th style={{ padding: '0.75rem' }}>Sessions (Range)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.allEmployees.map((emp: any) => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => window.location.href = `/hr/analytics/${emp.id}`}>
                                    <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--primary)' }}>{emp.name}</td>
                                    <td style={{ padding: '0.75rem', color: '#64748b' }}>{emp.email}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {emp.sessionsRange > 0
                                            ? <span style={{ color: '#16a34a', fontWeight: 600 }}>{emp.sessionsRange}</span>
                                            : <span style={{ color: '#94a3b8' }}>-</span>}
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

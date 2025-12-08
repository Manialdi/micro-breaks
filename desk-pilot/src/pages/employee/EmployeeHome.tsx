import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { dbService } from '../../services/databaseService';
import { supabase } from '../../lib/supabase';

export const EmployeeHome = () => {
    const location = useLocation();
    const [name, setName] = useState('');
    const [routine, setRoutine] = useState<any[]>([]);
    const [progress, setProgress] = useState(0); // 0 to 100
    const [sessionsCount, setSessionsCount] = useState(0);

    useEffect(() => {
        loadDashboard();
    }, [location.key]);

    const loadDashboard = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Get Name
            const { data: dbUser } = await supabase.from('users').select('name').eq('id', user.id).single();
            if (dbUser) setName(dbUser.name);

            // Get Routine
            try {
                const exercises = await dbService.getEmployeeDailyRoutine();
                setRoutine(exercises || []);
            } catch (err) {
                console.error(err);
            }

            // Get Stats
            try {
                const stats = await dbService.getEmployeeStats(user.id);
                setSessionsCount(stats.todaySessions);
                // Goal is 3 sessions a day
                setProgress(Math.min((stats.todaySessions / 3) * 100, 100));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            {/* Welcome Section */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{
                    width: '64px', height: '64px', background: 'var(--primary)',
                    borderRadius: '16px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 'bold', fontSize: '1.5rem'
                }}>
                    DP
                </div>
                <h1>Welcome back, {name || 'Pilot'}!</h1>
                <p style={{ color: 'var(--text-muted)' }}>Ready for your wellness journey today?</p>
            </div>

            {/* Daily Progress */}
            <Card style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem' }}>Today's Goal: 3 Microbreaks</h3>
                <div style={{
                    height: '24px', background: '#e2e8f0', borderRadius: '12px',
                    overflow: 'hidden', maxWidth: '400px', margin: '0 auto 1rem', position: 'relative'
                }}>
                    <div style={{
                        height: '100%', width: `${progress}%`, background: '#22c55e',
                        transition: 'width 0.5s ease'
                    }} />
                    <span style={{
                        position: 'absolute', width: '100%', top: 0, left: 0, lineHeight: '24px',
                        fontSize: '0.75rem', fontWeight: 600, color: progress > 50 ? 'white' : 'black'
                    }}>
                        {sessionsCount} / 3 Completed
                    </span>
                </div>
                {progress >= 100 && (
                    <p style={{ color: '#166534', fontWeight: 600 }}>🌟 Goal Achieved! Great job!</p>
                )}
            </Card>

            {/* Daily Routine */}
            <h2 style={{ marginBottom: '1rem' }}>Today's Routine</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {routine.length > 0 ? routine.map(ex => (
                    <Card key={ex.id} title={ex.name} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{
                            height: '120px', background: '#f1f5f9', borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#94a3b8'
                        }}>
                            {/* Placeholder generic illustration */}
                            Illustration
                        </div>
                        <p style={{ color: 'var(--text-muted)', flex: 1, fontSize: '0.9rem' }}>
                            {ex.description ? ex.description.substring(0, 80) + '...' : 'Quick and effective microbreak exercise.'}
                        </p>
                        <Link to={`/employee/exercise/${ex.id}`} style={{ marginTop: '1rem' }}>
                            <Button fullWidth variant="secondary">Start Session</Button>
                        </Link>
                    </Card>
                )) : (
                    <p style={{ color: 'var(--text-muted)' }}>Loading exercises...</p>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/employee/leaderboard">
                    <Button variant="outline" size="lg">🏆 View Leaderboard</Button>
                </Link>
                <Link to="/employee/exercises">
                    <Button variant="outline" size="lg">📚 Full Library</Button>
                </Link>
            </div>
        </div>
    );
};

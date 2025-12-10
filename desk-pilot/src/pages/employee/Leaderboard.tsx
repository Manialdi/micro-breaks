import { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { dbService } from '../../services/databaseService';
import { supabase } from '../../lib/supabase';

export const Leaderboard = () => {
    const [view, setView] = useState<'weekly' | 'streak'>('weekly');
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [weeklyLeaders, setWeeklyLeaders] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [streakLeaders, setStreakLeaders] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: dbUser } = await supabase.from('users').select('company_id').eq('id', user.id).single();
                if (dbUser?.company_id) {
                    const data = await dbService.getLeaderboard(dbUser.company_id);
                    setWeeklyLeaders(data.weeklyTop);
                    setStreakLeaders(data.streakTop);
                }
            }
        } catch (error) {
            console.error('Failed to load leaderboard', error);
        } finally {
            setLoading(false);
        }
    };

    const currentList = view === 'weekly' ? weeklyLeaders : streakLeaders;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Leaderboard</h1>

            {/* Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px', display: 'flex' }}>
                    <button
                        onClick={() => setView('weekly')}
                        style={{
                            padding: '0.5rem 1.5rem',
                            border: 'none',
                            borderRadius: '6px',
                            background: view === 'weekly' ? 'white' : 'transparent',
                            color: view === 'weekly' ? 'var(--primary)' : 'var(--text-muted)',
                            boxShadow: view === 'weekly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Weekly Activity
                    </button>
                    <button
                        onClick={() => setView('streak')}
                        style={{
                            padding: '0.5rem 1.5rem',
                            border: 'none',
                            borderRadius: '6px',
                            background: view === 'streak' ? 'white' : 'transparent',
                            color: view === 'streak' ? '#ea580c' : 'var(--text-muted)',
                            boxShadow: view === 'streak' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Streak Champions
                    </button>
                </div>
            </div>

            <Card>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading champions...</div>
                ) : currentList.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No activity recorded yet. Be the first!</div>
                ) : (
                    currentList.map((user, index) => {
                        // Rank is index + 1
                        const rank = index + 1;
                        const score = view === 'weekly' ? user.weeklyScore : user.streak;
                        const label = view === 'weekly' ? 'sessions' : 'days';

                        return (
                            <div key={user.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                borderBottom: index !== currentList.length - 1 ? '1px solid var(--border)' : 'none',
                                backgroundColor: rank <= 3 && view === 'streak' ? '#fff7ed' : (rank <= 3 ? '#eff6ff' : 'transparent')
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: rank <= 3 ? (rank === 1 ? '#fcd34d' : rank === 2 ? '#94a3b8' : '#fb923c') : '#e2e8f0',
                                    color: rank <= 3 ? 'white' : '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    marginRight: '1rem',
                                    fontSize: rank <= 3 ? '1.1rem' : '0.9rem'
                                }}>
                                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {view === 'weekly' ? 'Last 7 Days' : 'Current Streak'}
                                    </div>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: view === 'streak' ? '#ea580c' : 'var(--primary)' }}>
                                    {score} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>{label}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </Card>
        </div>
    );
};

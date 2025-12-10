import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { dbService } from '../../services/databaseService';
import { supabase } from '../../lib/supabase';

export const ExerciseDetail = () => {
    const { id } = useParams();
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    // We need user context to log the session
    const handleComplete = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Quick fetch of company_id (in a real app, might want to store this in context)
            const { data: dbUser } = await supabase
                .from('users')
                .select('company_id')
                .eq('id', user.id)
                .single();

            if (!dbUser?.company_id) throw new Error('No company found for user');

            await dbService.logSession({
                user_id: user.id,
                company_id: dbUser.company_id,
                exercise_id: id, // Assuming id matches DB id, or if id is just for route, we might need to look it up. 
                // For now, let's assume the route param IS the exercise UUID. 
                // If the route uses a "slug" or "index", we'd need to fetch the exercise first.
                // Given previous context, it seems to be the ID.
                timestamp: new Date().toISOString(),
                source: 'manual',
                duration_seconds: 120 // Hardcoded 2 mins based on instructions
            });

            setCompleted(true);
            setShowPopup(true);

            // Hide popup after 3 seconds
            setTimeout(() => {
                setShowPopup(false);
            }, 3000);

        } catch (error) {
            console.error('Failed to log session', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alert(`Failed to save: ${(error as any).message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <Link to="/employee/exercises" style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'inline-block' }}>
                &larr; Back to Library
            </Link>

            <h1 style={{ marginBottom: '1rem' }}>Exercise {id}: Desk Stretches</h1>

            <Card padding="none" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{
                    height: '400px',
                    backgroundColor: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                }}>
                    Video / Animation Placeholder
                </div>
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem' }}>Instructions</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Duration: 2 minutes</p>
                        </div>
                        <Button
                            size="lg"
                            variant={completed ? 'secondary' : 'primary'}
                            onClick={handleComplete}
                            disabled={completed || loading}
                        >
                            {loading ? 'Saving...' : (completed ? 'Completed!' : 'Mark Completed')}
                        </Button>
                    </div>

                    <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                        <li>Sit upright with feet flat on the floor.</li>
                        <li>Slowly tilt your head to the right, bringing your ear toward your shoulder.</li>
                        <li>Hold for 15-30 seconds.</li>
                        <li>Return to center and repeat on the left side.</li>
                        <li>Repeat 3 times on each side.</li>
                    </ol>
                </div>
            </Card>

            {/* Success Popup */}
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    animation: 'slideIn 0.3s ease-out',
                    zIndex: 100
                }}>
                    <strong>Nice work!</strong> Session completed.
                </div>
            )}
        </div>
    );
};

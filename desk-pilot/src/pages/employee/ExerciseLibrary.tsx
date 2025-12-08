import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const ExerciseLibrary = () => {
    const exercises = [
        { id: 1, title: 'Neck Stretches', category: 'Mobility', duration: '2 min' },
        { id: 2, title: 'Wrist Relief', category: 'Mobility', duration: '1 min' },
        { id: 3, title: 'Eye Relaxation', category: 'Health', duration: '2 min' },
        { id: 4, title: 'Seated Spine Twist', category: 'Yoga', duration: '3 min' },
        { id: 5, title: 'Shoulder Rolls', category: 'Mobility', duration: '1 min' },
        { id: 6, title: 'Deep Breathing', category: 'Mindfulness', duration: '2 min' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Exercise Library</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {exercises.map(ex => (
                    <Card key={ex.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{
                            height: '150px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)'
                        }}>
                            placeholder image
                        </div>
                        <h3 style={{ marginBottom: '0.5rem' }}>{ex.title}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            <span>{ex.category}</span>
                            <span>•</span>
                            <span>{ex.duration}</span>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <Link to={`/employee/exercise/${ex.id}`}>
                                <Button fullWidth variant="outline">View Details</Button>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

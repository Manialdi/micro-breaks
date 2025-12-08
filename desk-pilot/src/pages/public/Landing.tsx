import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const Landing = () => {
    return (
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '4rem 0' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Boost Workplace Wellness with Microbreaks
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.6 }}>
                DeskPilot helps your team stay active, focused, and healthy with scheduled desk-friendly exercises.
                Combats sedentary fatigue and improves productivity.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/auth/hr/signup">
                    <Button size="lg">Get Started as HR</Button>
                </Link>
                <Link to="/auth/employee/login">
                    <Button size="lg" variant="secondary">Employee Login</Button>
                </Link>
            </div>

            <div style={{ marginTop: '4rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Why DeskPilot?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                    <div>
                        <h3 style={{ color: 'var(--primary)' }}>Easy Setup</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Get your whole team onboarded in minutes using our simple HR dashboard.</p>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--primary)' }}>Guided Exercises</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Curated library of 2-minute exercises designed for the office environment.</p>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--primary)' }}>Track Progress</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Monitor engagement and improved wellness metrics across the organization.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

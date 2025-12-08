import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';

export const HRLogin = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login
        navigate('/hr/dashboard');
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>HR Login</h1>
            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input label="Email Address" type="email" placeholder="hr@company.com" required />
                    <Input label="Password" type="password" placeholder="••••••••" required />

                    <Button type="submit" fullWidth>Log In</Button>

                    <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/auth/hr/signup" style={{ color: 'var(--primary)' }}>Sign Up</Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};

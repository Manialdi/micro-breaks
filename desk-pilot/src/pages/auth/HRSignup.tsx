import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { dbService } from '../../services/databaseService';

export const HRSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await dbService.registerHRWorkflow({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                companyName: formData.companyName
            });
            // 5. & 6. Auto Login handled by signUp usually, redirect to Dashboard
            navigate('/hr/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h1>
            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && <div style={{ color: 'red', fontSize: '0.875rem' }}>{error}</div>}

                    <Input
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <Input
                        label="Company Name"
                        name="companyName"
                        placeholder="Acme Inc."
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="hr@company.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/auth/hr/login" style={{ color: 'var(--primary)' }}>Log In</Link>
                    </div>
                </form>
            </Card>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                By signing up, you agree to our Terms and Privacy Policy.
            </div>
        </div>
    );
};

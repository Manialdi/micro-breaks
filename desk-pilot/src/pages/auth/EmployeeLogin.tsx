import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { supabase } from '../../lib/supabase';

export const EmployeeLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    // For demo/prototype purposes, we might just assume a default password or allow blank for "invited" flow
    // But since Supabase requires a password, we will ask for it.
    // NOTE: In the Add Employee flow we mentioned "Temporary Password: Welcome2025!"
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (data.user) {
                // Verify this user is actually an employee
                const { data: dbUser } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (dbUser?.role !== 'employee') {
                    throw new Error('Access denied: specific to employees only.');
                }

                navigate('/employee/home');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Employee Login</h1>
            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && <div style={{ color: 'red', fontSize: '0.875rem' }}>{error}</div>}

                    <Input
                        label="Work Email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { dbService } from '../../services/databaseService';

export const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [inviteData, setInviteData] = useState<any>(null);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Missing invitation token');
            setLoading(false);
            return;
        }

        verifyToken(token);
    }, [token]);

    const verifyToken = async (t: string) => {
        try {
            const { data, error } = await dbService.getInvitation(t);
            if (error || !data) throw new Error('Invalid invitation');
            setInviteData(data);
        } catch (err) {
            console.error(err); // Log error to use the variable
            setError('This invitation is invalid or has expired.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!token) throw new Error('Missing invitation token');
            await dbService.acceptInvitation({
                token,
                name,
                password
            });
            // Redirect to login or home
            navigate('/auth/employee/login'); // Or directly home if auto-signed in? Supabase usually auto-signs in.
            // Let's assume auto-signin works, so:
            navigate('/employee/home');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to join');
            setLoading(false);
        }
    };

    if (loading && !inviteData) {
        return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading invitation...</div>;
    }

    if (error) {
        return (
            <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
                <Card>
                    <h2 style={{ color: 'red' }}>Error</h2>
                    <p>{error}</p>
                    <Button onClick={() => navigate('/')} style={{ marginTop: '1rem' }} variant="outline">Go Home</Button>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1>Join {inviteData?.companies?.name}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Create your employee account</p>
            </div>

            <Card>
                <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '4px', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Invited email:</span>
                        <div style={{ fontWeight: 600 }}>{inviteData?.email}</div>
                    </div>

                    <Input
                        label="Full Name"
                        placeholder="e.g. Alex Smith"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <Input
                        label="Create Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <Button type="submit" fullWidth disabled={loading}>
                        {loading ? 'Setting up...' : 'Create Account'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

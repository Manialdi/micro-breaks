import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const ProtectedHRRoute = ({ children }: { children?: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [isHR, setIsHR] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkAccess();
    }, []);

    const checkAccess = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Not logged in
                setLoading(false);
                return;
            }

            // Check Role. 
            // Note: We should ideally check the 'users' table for source of truth, 
            // but for performance, checking metadata (if synced) or just the table is fine.
            // Let's check the table to be 100% strict as per "Strict access control"
            const { data: user } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (user && user.role === 'hr') {
                setIsHR(true);
            }
        } catch (error) {
            console.error('Auth check failed', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Checking permissions...</div>;
    }

    if (!isHR) {
        // Redirect logic:
        // Prompt says: "Redirect them to the main login page." AND "Add a simple fallback UI".
        // I will render the UI, but also redirect? 
        // Or render the UI which *contains* the redirect action.
        // Let's show the UI as requested.
        return (
            <div style={{ padding: '4rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Access Denied</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>You do not have permission to view this dashboard.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/auth/login')}
                        style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Go to Login
                    </button>
                    <button
                        // Fallback for an employee accidentally trying to access HR URL
                        onClick={() => navigate('/')}
                        style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Home
                    </button>
                </div>
            </div>
        );
    }

    // Access granted
    return children ? <>{children}</> : <Outlet />;
};

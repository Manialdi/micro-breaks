import { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { dbService } from '../../services/databaseService';
import { supabase } from '../../lib/supabase';

// Helper to show modal
const PreviewModal = ({ emails, onConfirm, onCancel }: { emails: string[], onConfirm: () => void, onCancel: () => void }) => (
    <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
            <h3>Preview Invite Email</h3>
            <div style={{ margin: '1rem 0', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '4px', fontSize: '0.9rem' }}>
                <p><strong>To:</strong> {emails.join(', ')}</p>
                <p><strong>Subject:</strong> You're invited to join Micro-Breaks!</p>
                <hr style={{ margin: '0.5rem 0', borderColor: '#e2e8f0' }} />
                <p>Hello,</p>
                <p>Your company has invited you to join Micro-Breaks to improve workplace wellness.</p>
                <p>Click the link below to set up your account:</p>
                <p style={{ color: 'blue', textDecoration: 'underline' }}>{window.location.origin}/join?token=&lt;UNIQUE_TOKEN&gt;</p>
                <p>Temporary Password: <strong>Welcome2025!</strong></p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm}>Send Invites</Button>
            </div>
        </div>
    </div>
);

export const AddEmployees = () => {
    const [employees, setEmployees] = useState<any[]>([]);
    const [inputEmails, setInputEmails] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedLinks, setGeneratedLinks] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Need to get the HR's company ID first
            const { data: dbUser } = await supabase.from('users').select('company_id').eq('id', user.id).single();
            if (dbUser?.company_id) {
                setCurrentUser({ ...user, company_id: dbUser.company_id });
                loadEmployees(dbUser.company_id);
            }
        }
    };

    const loadEmployees = async (companyId: string) => {
        try {
            const data = await dbService.getCompanyEmployees(companyId);
            setEmployees(data || []);
        } catch (error) {
            console.error('Failed to load employees', error);
        }
    };

    const handleInviteClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputEmails.trim()) setShowPreview(true);
    };

    const handleConfirmInvite = async () => {
        if (!currentUser?.company_id) {
            alert('Error: user profile not fully loaded or missing company.');
            return;
        }

        setShowPreview(false);
        setLoading(true);
        setGeneratedLinks([]); // Clear previous

        const emailList = inputEmails.split(',').map(e => e.trim()).filter(e => e);

        try {
            const { results } = await dbService.inviteEmployees(emailList, currentUser.company_id);
            setInputEmails('');
            loadEmployees(currentUser.company_id);

            // Show the simulated links in the UI
            if (results && results.length > 0) {
                setGeneratedLinks(results);
            }

        } catch (error) {
            console.error('Failed to invite', error);
            alert('Failed to send some invites');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Manage Employees</h1>

            <Card title="Invite New Employees" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleInviteClick} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <Input
                            label="Email Addresses (comma separated)"
                            placeholder="john@company.com, jane@company.com"
                            value={inputEmails}
                            onChange={(e) => setInputEmails(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Preview Invite'}
                    </Button>
                </form>
            </Card>

            {generatedLinks.length > 0 && (
                <Card title="✅ Invitations Sent (Simulation Mode)" style={{ marginBottom: '2rem', borderColor: '#22c55e' }}>
                    <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '4px' }}>
                        <p style={{ marginBottom: '1rem', color: '#166534' }}>
                            Since we are in simulation mode (no email server), please share these links with your users manually:
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {generatedLinks.map((link: any) => (
                                <li key={link.id} style={{ marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <strong>{link.email}</strong>
                                    <a
                                        href={`${window.location.origin}/join?token=${link.token}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'blue', wordBreak: 'break-all' }}
                                    >
                                        {window.location.origin}/join?token={link.token}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <Button size="sm" variant="outline" onClick={() => setGeneratedLinks([])} style={{ marginTop: '1rem' }}>
                            Clear
                        </Button>
                    </div>
                </Card>
            )}

            <Card title="Employee Directory">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Sessions (Today/Total)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No employees yet. Invite some above!
                                </td>
                            </tr>
                        ) : employees.map(emp => (
                            <tr key={emp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{emp.name}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{emp.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.875rem',
                                        backgroundColor: emp.status === 'active' ? '#dcfce7' : '#fef9c3',
                                        color: emp.status === 'active' ? '#166534' : '#854d0e',
                                        textTransform: 'capitalize'
                                    }}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {emp.stats ? `${emp.stats.todaySessions} / ${emp.stats.totalSessions}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {showPreview && (
                <PreviewModal
                    emails={inputEmails.split(',').filter(e => e.trim())}
                    onConfirm={handleConfirmInvite}
                    onCancel={() => setShowPreview(false)}
                />
            )}
        </div>
    );
};

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';

export const CompanySettings = () => {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1>Company Settings</h1>

            <Card title="General Preferences">
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Input label="Company Name" defaultValue="Acme Inc." />

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Input label="Work Day Start" type="time" defaultValue="09:00" />
                        <Input label="Work Day End" type="time" defaultValue="17:00" />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Microbreak Frequency</label>
                        <select style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg-card)'
                        }}>
                            <option>Every 30 minutes</option>
                            <option selected>Every 60 minutes</option>
                            <option>Every 90 minutes</option>
                            <option>Every 2 hours</option>
                        </select>
                    </div>

                    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export const HowItWorks = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>How DeskPilot Works</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--border)', lineHeight: 1 }}>1</div>
                    <div>
                        <h3>Sign Up (HR)</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            HR administrators create an account and set up the company profile.
                            They can invite employees via email or generate access codes.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--border)', lineHeight: 1 }}>2</div>
                    <div>
                        <h3>Connect Employees</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Employees log in to their personal dashboard. They can set their availability and preferences.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--border)', lineHeight: 1 }}>3</div>
                    <div>
                        <h3>Get Moving</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            DeskPilot reminds team members to take scheduled microbreaks with
                            guided exercises like neck stretches, desk yoga, and eye relaxation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Activity, Zap, BarChart3, ArrowRight } from 'lucide-react';

export const Landing = () => {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            {/* Hero Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                alignItems: 'center',
                padding: '6rem 0 4rem',
                minHeight: '80vh'
            }}>
                {/* Left Content */}
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        lineHeight: '1.1',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Wellness that actually gets used.
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-muted)',
                        marginBottom: '2.5rem',
                        lineHeight: 1.6,
                        maxWidth: '540px'
                    }}>
                        Micro Breaks delivers science-backed 2-minute breaks through gentle reminders employees love, with dashboards HR teams trust.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                        <Link to="/auth/hr/signup">
                            <Button size="lg" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                Start free for your team
                            </Button>
                        </Link>
                        <Link to="/how-it-works">
                            <Button size="lg" variant="secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                See how it works <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </div>

                    {/* Mini Benefits */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                            <div style={{ background: '#ecfdf5', padding: '6px', borderRadius: '50%', color: '#059669' }}>
                                <Activity size={20} />
                            </div>
                            <span style={{ fontWeight: 500 }}>Reduce pain & fatigue</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                            <div style={{ background: '#fffbeb', padding: '6px', borderRadius: '50%', color: '#d97706' }}>
                                <Zap size={20} />
                            </div>
                            <span style={{ fontWeight: 500 }}>Boost focus & mood</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                            <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '50%', color: '#2563eb' }}>
                                <BarChart3 size={20} />
                            </div>
                            <span style={{ fontWeight: 500 }}>Give HR real wellness insights</span>
                        </div>
                    </div>
                </div>

                {/* Right Image Placeholder */}
                <div style={{
                    position: 'relative',
                    isolation: 'isolate'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderRadius: '24px',
                        padding: '2rem',
                        aspectRatio: '4/3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ textAlign: 'center', color: '#166534', opacity: 0.8 }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧘‍♂️</div>
                            <div style={{ fontWeight: 600 }}>Product Dashboard Preview</div>
                        </div>
                    </div>
                    {/* Decorative Blob */}
                    <div style={{
                        position: 'absolute',
                        top: '-10%',
                        right: '-10%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(74, 222, 128, 0.2) 0%, rgba(255,255,255,0) 70%)',
                        zIndex: -1,
                        borderRadius: '50%'
                    }} />
                </div>
            </div>

            {/* Existing 'Why DeskPilot' section kept but styled to match if needed, can serve as features below fold */}


            <div style={{ marginTop: '4rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Why Micro-Breaks?</h2>
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

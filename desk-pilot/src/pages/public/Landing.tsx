import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Activity, Zap, BarChart3, ArrowRight, Users, Globe, Bell, PlayCircle, LayoutDashboard } from 'lucide-react';

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


            {/* Problem & Solution Section */}
            <div style={{ marginTop: '8rem', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '1rem',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Your team sits all day. Their bodies weren’t designed for it.
                </h2>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-muted)',
                    maxWidth: '700px',
                    margin: '0 auto 4rem',
                    lineHeight: 1.6
                }}>
                    Long periods of sitting lead to stiffness, eye strain, and burnout. Micro Breaks introduces simple wellness habits throughout the day without requiring another heavy program.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '2rem',
                    textAlign: 'left'
                }}>
                    {/* Card 1 */}
                    <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ width: '48px', height: '48px', background: '#ecfdf5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '1.5rem' }}>
                            <Activity size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Less pain, more comfort</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            Gentle micro stretches reduce neck, shoulder, and back strain before it becomes a problem.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ width: '48px', height: '48px', background: '#fffbeb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '1.5rem' }}>
                            <Zap size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Sharper focus, better work</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            Short, active breaks improve attention span and mental clarity for complex tasks.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '1.5rem' }}>
                            <Users size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Healthier culture</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            Build trust and engagement by showing your team you genuinely care about their wellbeing.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ width: '48px', height: '48px', background: '#f5f3ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', marginBottom: '1.5rem' }}>
                            <Globe size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Wellness that scales</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            Works seamlessly across different office locations, remote teams, and time zones.
                        </p>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div style={{ marginTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '4rem',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Tiny breaks, big impact — in three simple steps.
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '3rem',
                    textAlign: 'left'
                }}>
                    {/* Step 1 */}
                    <div>
                        <div style={{
                            fontSize: '4rem',
                            fontWeight: 800,
                            color: '#ecfdf5',
                            lineHeight: 1,
                            marginBottom: '1rem',
                            WebkitTextStroke: '2px #059669'
                        }}>01</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Set up your team</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            HR or team leads invite employees, set default break frequency, and choose the initial exercise sets.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div>
                        <div style={{
                            fontSize: '4rem',
                            fontWeight: 800,
                            color: '#eff6ff',
                            lineHeight: 1,
                            marginBottom: '1rem',
                            WebkitTextStroke: '2px #2563eb'
                        }}>02</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Employees get gentle reminders</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            Friendly, non-intrusive nudges on Chrome or mobile guide employees to take quick 2-minute breaks.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div>
                        <div style={{
                            fontSize: '4rem',
                            fontWeight: 800,
                            color: '#fdf4ff',
                            lineHeight: 1,
                            marginBottom: '1rem',
                            WebkitTextStroke: '2px #db2777'
                        }}>03</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Track usage & wellbeing</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            HR sees participation, trends, and wellness signals to measure impact and adjust cadence.
                        </p>
                    </div>
                </div>
            </div>


            {/* Feature Grid Section */}
            <div style={{ marginTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    marginBottom: '4rem',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    Everything you need to build better workday habits.
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    textAlign: 'left'
                }}>
                    {/* Feature 1 */}
                    <div style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <div style={{ width: '56px', height: '56px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <Bell size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Smart Break Reminders</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            Reminders adapt to your team’s rhythm. Set default schedules or let employees customize. Subtle, respectful, never disruptive.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <div style={{ width: '56px', height: '56px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <PlayCircle size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>2-Minute Guided Exercises</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            Simple stretches and resets designed for eyes, neck, shoulders, wrists, and posture. No equipment. No learning curve.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <div style={{ width: '56px', height: '56px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <LayoutDashboard size={28} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>HR Wellness Dashboard</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            Understand adoption, participation, and wellbeing trends across teams. Spot burnout risk early with data-backed insights.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

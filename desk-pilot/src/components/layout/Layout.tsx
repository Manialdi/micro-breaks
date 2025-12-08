import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, padding: 'var(--spacing-lg) 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-md)' }}>
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};

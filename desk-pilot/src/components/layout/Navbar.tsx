import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import './Navbar.css';

export const Navbar = () => {
    const location = useLocation();
    const path = location.pathname;

    // Simple logic to determine which portal we are in
    const isHR = path.startsWith('/hr');
    const isEmployee = path.startsWith('/employee');
    const isAuth = path.startsWith('/auth');

    // Placeholder for logout - just links to home/login for now
    const handleLogout = () => {
        // Logic later
        window.location.href = '/';
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.png" alt="Micro-Breaks" style={{ height: '32px', width: 'auto' }} />
                </Link>

                <nav className="navbar-links">
                    {!isHR && !isEmployee && !isAuth && (
                        <>
                            <Link to="/how-it-works">How It Works</Link>
                            <Link to="/auth/hr/login">HR Portal</Link>
                            <Link to="/auth/employee/login">Employee Login</Link>
                        </>
                    )}

                    {isHR && (
                        <>
                            <Link to="/hr/dashboard">Dashboard</Link>
                            <Link to="/hr/employees">Employees</Link>
                            <Link to="/hr/settings">Settings</Link>
                            <Button size="sm" variant="outline" onClick={handleLogout}>Log Out</Button>
                        </>
                    )}

                    {isEmployee && (
                        <>
                            <Link to="/employee/home">Home</Link>
                            <Link to="/employee/exercises">Exercises</Link>
                            <Link to="/employee/history">History</Link>
                            <Link to="/employee/leaderboard">Leaderboard</Link>
                            <Button size="sm" variant="outline" onClick={handleLogout}>Log Out</Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

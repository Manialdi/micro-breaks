import './Footer.css';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; {new Date().getFullYear()} DeskPilot. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

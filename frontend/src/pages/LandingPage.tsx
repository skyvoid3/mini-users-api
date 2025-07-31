import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="landing-container">
            <h1>Welcome to MyApp</h1>
            <p>Your productivity companion for daily tasks.</p>
            <div className="cta-buttons">
                <Link to="/signup" className="btn">
                    Sign Up
                </Link>
                <Link to="/login" className="btn btn-secondary">
                    Log In
                </Link>
            </div>
        </div>
    );
}

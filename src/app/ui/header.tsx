import { Link } from 'react-router-dom';
import { ROUTES } from '../../shared/routes';
import './module.css'

export const Header = () => {
    return (
        <header className="app-header">
            <h1>STAR TREK Heroes Search</h1>
            <nav>
                <Link to={ROUTES.HOME}>Home</Link>
                <Link to={ROUTES.ABOUT_US}>About Us</Link>
            </nav>
        </header>        
    );
};

